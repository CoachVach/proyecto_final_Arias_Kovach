import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CrearMesaPage.css';
import * as XLSX from 'xlsx';

const CrearMesaPage = () => {
  const [fecha, setFecha] = useState('');
  const [materia, setMateria] = useState('');
  const [error, setError] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const formattedData = jsonData.slice(1).map((row) => ({
          nombre: row[0],
          apellido: row[1],
          dni: row[2],
          lu: row[3],
          carrera: row[4],
        }));

        setAlumnos(formattedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No se encontró el token de autenticación');
      return;
    }

    let mesaId = null; // Guardar el ID de la mesa creada

    try {
      // Crear la mesa
      const mesaResponse = await fetch('http://localhost:3000/api/mesas', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fecha, materia }),
      });

      if (!mesaResponse.ok) {
        throw new Error('Error al crear la mesa de examen');
      }

      const mesa = await mesaResponse.json();
      mesaId = mesa.id_mesa;

      // Agregar el ID de la mesa a cada alumno
      const alumnosConMesa = alumnos.map((alumno) => ({
        ...alumno,
        id_mesa: mesaId,
      }));

      // Enviar los alumnos al backend
      for (const alumno of alumnosConMesa) {
        if (!alumno.dni){
          continue;
        }
        const alumnoResponse = await fetch('http://localhost:3000/api/alumnos', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(alumno),
        });

        if (!alumnoResponse.ok) {
          throw new Error('Error al crear un alumno');
        }
      }

      alert('Mesa y alumnos creados correctamente');
      navigate('/mesas');
    } catch (error) {
      setError(error.message);

      // Eliminar la mesa si fue creada
      if (mesaId) {
        try {
          await fetch(`http://localhost:3000/api/mesas/${mesaId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('Mesa eliminada debido a un error al crear alumnos.');
        } catch (deleteError) {
          console.error('Error al intentar eliminar la mesa:', deleteError.message);
        }
      }
    }
  };

  return (
    <div className="crear-mesa-page">
      <h1>Crear Mesa de Examen</h1>
      <form onSubmit={handleSubmit} className="crear-mesa-form">
        <div className="form-group">
          <label htmlFor="fecha">Fecha: </label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="materia">Materia: </label>
          <input
            type="text"
            id="materia"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="archivo">Cargar Alumnos (Excel): </label>
          <input
            type="file"
            id="archivo"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>
        <button type="submit" className="submit-button">Crear</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CrearMesaPage;

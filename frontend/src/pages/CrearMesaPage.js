import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../styles/pages/CrearMesaPage.css';
import { createMesa, createAlumno, deleteMesa } from '../services/apiService';
import FormInput from '../components/FormInput';
import FileUpload from '../components/FileUpload';
import ErrorMessage from '../components/common/ErrorMessage';

const CrearMesaPage = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    materia: '',
    listaColaboradores: [],
    alumnos: [],
    error: null,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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

        const startRowIndex = jsonData.findIndex(
          (row) =>
            row[0] === 'Legajo' && row[1] === 'Nombre' && row[2] === 'Doc' && row[3] === 'Número'
        );

        if (startRowIndex === -1) {
          console.error('No se encontró la tabla en la hoja de cálculo.');
          return;
        }

        const endRowIndex = jsonData
          .slice(startRowIndex + 1)
          .findIndex((row) => !row[0]);

        const actualEndIndex =
          endRowIndex === -1 ? jsonData.length : startRowIndex + 1 + endRowIndex;
        const formattedData = jsonData.slice(startRowIndex + 1, actualEndIndex).map((row) => ({
          doc: row[2],
          nro_identidad: row[3],
          lu: row[0],
          nombre_completo: row[1],
          carrera: row[6],
          calidad: row[4],
          codigo: row[5],
          plan: row[7],
        }));

        setFormData((prevData) => ({ ...prevData, alumnos: formattedData }));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.fecha);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('La fecha ingresada ya ha pasado. Por favor, selecciona una fecha válida.');
      return;
    }
    setShowConfirm(true);
  };

  const confirmCreate = async () => {
    let mesaId = null;
    try {
      const mesa = await createMesa({
        fecha: formData.fecha,
        materia: formData.materia,
        listaColaboradores: formData.listaColaboradores,
      });
      mesaId = mesa.id_mesa;

      const alumnosConMesa = formData.alumnos.map((alumno) => ({
        ...alumno,
        presente: false,
        inscripto: true,
        id_mesa: mesaId,
      }));

      for (const alumno of alumnosConMesa) {
        if (alumno.nro_identidad) {
          await createAlumno(alumno);
        }
      }

      alert('Mesa y alumnos creados correctamente');
      navigate('/mesas');
    } catch (error) {
      setFormData((prevData) => ({ ...prevData, error: error.message }));
      if (mesaId) {
        await deleteMesa(mesaId);
      }
    }
    setShowConfirm(false);
  };

  const handleEmailChange = (e) => setEmail(e.target.value);

  const addEmail = () => {
    if (email && !formData.listaColaboradores.includes(email)) {
      setFormData((prevData) => ({
        ...prevData,
        listaColaboradores: [...prevData.listaColaboradores, email],
      }));
      setEmail('');
    }
  };

  const removeEmail = (correo) => {
    setFormData((prevData) => ({
      ...prevData,
      listaColaboradores: prevData.listaColaboradores.filter((email) => email !== correo),
    }));
  };

  return (
    <div className="crear-mesa-page">
      <h1>Crear Mesa de Examen</h1>
      <form onSubmit={handleSubmit} className="crear-mesa-form">
        <FormInput label="Fecha:" type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} required />
        <FormInput label="Materia:" type="text" name="materia" value={formData.materia} onChange={handleInputChange} required />
        <FileUpload onFileChange={handleFileUpload} />
        <div className="email-input-container">
          <input type="email" value={email} onChange={handleEmailChange} placeholder="Agregar correo" />
          <button type="button" onClick={addEmail} className="add-email-button">Agregar</button>
        </div>
        <div className="email-list">
          {formData.listaColaboradores.map((correo, index) => (
            <div key={index} className="email-item">
              <span>{correo}</span>
              <button className="delete-email-button" onClick={() => removeEmail(correo)}>-</button>
            </div>
          ))}
        </div>
        <button type="submit" className="submit-button">Crear</button>
      </form>
      {showConfirm && (
        <div className="confirm-popup">
          <p>¿Estás seguro de que deseas crear esta mesa?</p>
          <button onClick={confirmCreate} className="confirm-button">Sí</button>
          <button onClick={() => setShowConfirm(false)} className="cancel-button">No</button>
        </div>
      )}
      <ErrorMessage error={formData.error} />
    </div>
  );
};

export default CrearMesaPage;
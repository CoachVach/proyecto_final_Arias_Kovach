import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../styles/pages/CrearMesaPage.css';
import { createMesa, createAlumnos, deleteMesa } from '../services/apiService';
import FormInput from '../components/FormInput';
import FileUpload from '../components/FileUpload';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';


const CrearMesaPage = () => {
  const [formData, setFormData] = useState({
    fecha: '',
    materia: '',
    listaColaboradores: [],
    alumnos: [],
    error: null,
  });
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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

        let planilla_examen = true;

        let startRowIndex = jsonData.findIndex(
          (row) =>
            row[0] === 'Legajo' && row[1] === 'Nombre' && row[2] === 'Doc' && row[3] === 'Número'
        );

        if (startRowIndex === -1) {
          startRowIndex = jsonData.findIndex(
            (row) =>
              row[0] === 'Legajo' && row[1] === 'Alumno' && row[2] === 'Doc' && row[3] === 'Número'
          );
          planilla_examen = false;
        }

        if (startRowIndex === -1) {
          console.error('No se encontró la tabla en la hoja de cálculo.');
          return;
        }

        const endRowIndex = jsonData
          .slice(startRowIndex + 1)
          .findIndex((row) => !row[0]);

        const actualEndIndex =
          endRowIndex === -1 ? jsonData.length : startRowIndex + 1 + endRowIndex;
        let formattedData;
        if (planilla_examen) {
          formattedData = jsonData.slice(startRowIndex + 1, actualEndIndex).map((row) => ({
            doc: row[2],
            nro_identidad: row[3],
            lu: row[0],
            nombre_completo: row[1],
            carrera: row[6],
            calidad: row[4],
            codigo: row[5],
            plan: row[7],
          }));
        } else {
          formattedData = jsonData.slice(startRowIndex + 1, actualEndIndex).map((row) => ({
            doc: row[2],
            nro_identidad: row[3],
            lu: row[0],
            nombre_completo: row[1],
            carrera: null,
            calidad: null,
            codigo: null,
            plan: null,
          }));
        }

        setFormData((prevData) => ({ ...prevData, alumnos: formattedData }));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ajusta la fecha seleccionada para que se interprete en la zona horaria local
    const [year, month, day] = formData.fecha.split('-');
    const selectedDate = new Date(year, month - 1, day); // Meses en JavaScript son 0-indexados
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('La fecha ingresada ya ha pasado. Por favor, selecciona una fecha válida.');
      return;
    }

    let mesaId = null;

    try {
      setLoading(true);
      const mesa = await createMesa({
        fecha: selectedDate,
        materia: formData.materia,
        listaColaboradores: formData.listaColaboradores,
      });
      mesaId = mesa.id_mesa;
  
      // Filtrar alumnos inválidos
      const alumnosValidos = formData.alumnos.filter(
        (alumno) => alumno.lu !== null && alumno.doc !== null && alumno.nombre_completo !== null &&
                    alumno.lu !== ' ' && alumno.doc !== ' ' && alumno.nombre_completo !== ' ' &&
                    alumno.lu !== '' && alumno.doc !== '' && alumno.nombre_completo !== ''
      );
      console.log(alumnosValidos);
  
      if (alumnosValidos.length === 0) {
        throw new Error('Archivo Inválido: No se encontraron alumnos con datos completos.');
      }
  
      await createAlumnos({ alumnos: alumnosValidos, id_mesa: mesaId });
      navigate('/mesas');
    } catch (error) {
      setLoading(false);
      setFormData((prevData) => ({ ...prevData, error: error.message }));
  
      if (mesaId) {
        try {
          await deleteMesa(mesaId);
          console.log('Mesa eliminada debido a un error al crear alumnos.');
        } catch (deleteError) {
          console.error('Error al intentar eliminar la mesa:', deleteError.message);
        }
      }
    }
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

  if(loading){
    return <LoadingSpinner/>;
  }
  
  return (
    <div className="crear-mesa-page">
      <h1>Crear Mesa de Examen</h1>
      <form onSubmit={handleSubmit} className="crear-mesa-form">
        <FormInput label="Fecha:" type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} required />
        <FormInput label="Materia:" type="text" name="materia" value={formData.materia} onChange={handleInputChange} required />
        <FileUpload onFileChange={handleFileUpload} />
        <label>Colaboradores: </label>
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
      <ErrorMessage error={formData.error} />
    </div>
  );
};

export default CrearMesaPage;
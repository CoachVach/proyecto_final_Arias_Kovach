import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CrearMesaPage.css';

const CrearMesaPage = () => {
  const [fecha, setFecha] = useState('');
  const [materia, setMateria] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No se encontró el token de autenticación');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/mesas', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fecha, materia }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la mesa de examen');
      }

      alert('Mesa de examen creada correctamente');
      navigate('/mesas');
    } catch (error) {
      setError(error.message);
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
        <button type="submit" className="submit-button">Crear</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CrearMesaPage;

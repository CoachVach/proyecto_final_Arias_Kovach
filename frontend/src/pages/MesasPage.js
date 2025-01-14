import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MesasPage.css';

const MesasPage = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('http://localhost:3000/api/mesas/profesor', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
        if (response.status === 404) {
          setMesas([]);
          return;
        }

        if (!response.ok) {
          throw new Error('Error al obtener las mesas de examen');
        }

        const data = await response.json();
        setMesas(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMesas();
  }, []);

  const handleDelete = async (idMesa) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`http://localhost:3000/api/mesas/${idMesa}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la mesa');
      }

      // Eliminar la mesa de la lista localmente
      setMesas((prevMesas) => prevMesas.filter((mesa) => mesa.id_mesa !== idMesa));
    } catch (error) {
      console.error(error.message);
      alert('Hubo un problema al intentar eliminar la mesa.');
    }
  };

  if (loading) return <div className="loading">Cargando mesas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="mesas-page">
      <h1>Mesas de Examen</h1>
      {mesas.length === 0 ? (
        <div className="no-mesas">
          <p>No hay mesas de examen asociadas a este profesor.</p>
        </div>
      ) : (
        <div className="mesas-container">
          {mesas.map((mesa) => (
            <div key={mesa.id_mesa} className="mesa-box">
              <button
                className="delete-button"
                onClick={() => handleDelete(mesa.id_mesa)}
                title="Eliminar mesa"
              >
                🗑️
              </button>
              <h2>{mesa.materia}</h2>
              <p>
                <strong>Fecha:</strong> {new Date(mesa.fecha).toLocaleDateString()}
              </p>
              <button
                onClick={() => navigate('/mesadp', { state: { mesa } })}
                className="create-button"
              >
                Detalles
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate('/crear-mesa')} className="create-button">
        Crear Nueva Mesa
      </button>
    </div>
  );
};

export default MesasPage;

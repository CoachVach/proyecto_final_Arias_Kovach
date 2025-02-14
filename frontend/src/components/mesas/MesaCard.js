import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const MesaCard = ({ mesa, handleDelete, soyColaborador }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const deleteMesa = async () => {
      setLoading(true);
      handleDelete(mesa.id_mesa)
  };

  if (loading) return (
    <div key={mesa.id_mesa} className="mesa-box" style={{ maxWidth: '200px', maxHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoadingSpinner />
    </div>
  );

  return (
    <div key={mesa.id_mesa} className="mesa-box">
      {!soyColaborador && (
        <button 
          onClick={deleteMesa} 
          className="delete-button" 
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          ✖
        </button>
      )}
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
  );
};

export default MesaCard;
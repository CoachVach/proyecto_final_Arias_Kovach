import React from 'react';
import { useNavigate } from 'react-router-dom';

const MesaCard = ({ mesa, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div key={mesa.id_mesa} className="mesa-box">
      <button
        className="delete-button"
        onClick={() => onDelete(mesa.id_mesa)}
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
  );
};

export default MesaCard;

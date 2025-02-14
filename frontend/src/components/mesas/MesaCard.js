import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { agregarColaborador } from '../../services/apiService';

const MesaCard = ({ mesa, handleDelete, soyColaborador }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const deleteMesa = async () => {
      setLoading(true);
      handleDelete(mesa.id_mesa)
  };
  const [nuevoColaborador, setNuevoColaborador] = useState(''); // Estado para el nuevo colaborador

  if (loading) return (
    <div key={mesa.id_mesa} className="mesa-box" style={{ maxWidth: '200px', maxHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoadingSpinner />
    </div>
  );

  const handleAgregarColaborador = async () => {
    await agregarColaborador(nuevoColaborador, mesa.id_mesa); // Llamada al método agregarColaborador
      setNuevoColaborador(''); // Limpiar el input después de agregar
  };

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

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>

        <input 
          type="email"
          value={nuevoColaborador} 
          onChange={(e) => setNuevoColaborador(e.target.value)} 
          placeholder="Nuevo Colaborador" 
          style={{ marginRight: '10px' }}
        />

        <button onClick={handleAgregarColaborador} className="add-button" style={{ marginTop: '-5px' }}>Agregar Colaborador</button>

      </div>
    </div>
  );
};

export default MesaCard;
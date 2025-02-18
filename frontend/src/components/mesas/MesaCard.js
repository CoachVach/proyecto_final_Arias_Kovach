import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { agregarColaborador } from '../../services/apiService';
import ErrorMessage from '../common/ErrorMessage'; // Importar el componente de mensaje de error

const MesaCard = ({ mesa, handleDelete, soyColaborador }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const deleteMesa = async () => {
    if (window.confirm("¿Estás seguro de eliminar esta mesa?")) {
      setLoading(true);
      handleDelete(mesa.id_mesa)
    }
  };
  const [nuevoColaborador, setNuevoColaborador] = useState(''); // Estado para el nuevo colaborador
  const [error, setError] = useState(null);

  if (loading) return (
    <div key={mesa.id_mesa} className="mesa-box" style={{ maxWidth: '200px', maxHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <LoadingSpinner />
    </div>
  );

  const handleAgregarColaborador = async () => {
    try{
      setError('');
      await agregarColaborador(nuevoColaborador, mesa.id_mesa); 
      setNuevoColaborador('');
    }catch (error){
      setError(error.message); 
    }
  };

  return (
    <div key={mesa.id_mesa} className="mesa-box">
      <ErrorMessage error={error} />
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
      {!soyColaborador && (
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
      )}
    </div>
  );
};

export default MesaCard;
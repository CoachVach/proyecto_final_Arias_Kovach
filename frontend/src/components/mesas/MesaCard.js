import { useNavigate } from 'react-router-dom';

const MesaCard = ({ mesa }) => {
  const navigate = useNavigate();

  return (
    <div key={mesa.id_mesa} className="mesa-box">
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
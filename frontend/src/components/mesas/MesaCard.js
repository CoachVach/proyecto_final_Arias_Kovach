import { useNavigate } from 'react-router-dom';

const MesaCard = ({ mesa }) => {
  const navigate = useNavigate();
  //const [showConfirm, setShowConfirm] = useState(false);

  /*const handleDeleteClick = () => {
    setShowConfirm(true);
  };*/

  /*const confirmDelete = () => {
    onDelete(mesa.id_mesa);
    setShowConfirm(false);
  };*/

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
      {/* {showConfirm && (
        <div className="confirm-popup">
          <p>¿Estás seguro de que deseas eliminar esta mesa?</p>
          <button onClick={confirmDelete} className="confirm-button">Sí</button>
          <button onClick={() => setShowConfirm(false)} className="cancel-button">No</button>
        </div>
      )} */}
    </div>
  );
};

export default MesaCard;
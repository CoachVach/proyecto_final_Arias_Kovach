import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMesas, deleteMesa } from '../services/apiService'; // Importa las funciones del apiService
import MesasList from '../components/mesas/MesasList'; // Importar el componente de lista de mesas
import Loading from '../components/common/Loading'; // Importar el componente de carga
import ErrorMessage from '../components/common/ErrorMessage'; // Importar el componente de mensaje de error
import '../styles/pages/MesasPage.css';

const MesasPage = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const data = await getAllMesas();
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
      await deleteMesa(idMesa);
      setMesas((prevMesas) => prevMesas.filter((mesa) => mesa.id_mesa !== idMesa));
    } catch (error) {
      console.error(error.message);
      alert('Hubo un problema al intentar eliminar la mesa.');
    }
  };

  if (loading) return <Loading />;
  return (
    <div className="mesas-page">
      <h1>Mesas de Examen</h1>
      <ErrorMessage error={error} />
      {mesas.length === 0 ? (
        <div className="no-mesas">
          <p>No hay mesas de examen asociadas a este profesor.</p>
        </div>
      ) : (
        <MesasList mesas={mesas} onDelete={handleDelete} />
      )}

      <button onClick={() => navigate('/crear-mesa')} className="create-button">
        Crear Nueva Mesa
      </button>
    </div>
  );
};

export default MesasPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMesasByProfesor, getAllMesasByColaborador } from '../services/apiService'; // Importa las funciones del apiService
import MesasList from '../components/mesas/MesasList'; // Importar el componente de lista de mesas
import ErrorMessage from '../components/common/ErrorMessage'; // Importar el componente de mensaje de error
import '../styles/pages/MesasPage.css';
import socket from '../socket.js';
import LoadingSpinner from '../components/common/LoadingSpinner';


const MesasPage = () => {
  const [mesasProfesor, setMesasProfesor] = useState([]);
  const [mesasColaborador, setMesasColaborador] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  const fetchMesas = async () => {
    try {
      const fetchedMesasProfesor = await getAllMesasByProfesor();
      const fetchedMesasColaborador = await getAllMesasByColaborador();
  
      if (!fetchedMesasProfesor.length && !fetchedMesasColaborador.length) {
        setError("No se encontraron mesas disponibles para este usuario.");
      } else {
        setError(""); 
      }
  
      setMesasProfesor(fetchedMesasProfesor);
      setMesasColaborador(fetchedMesasColaborador);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchMesas();
    socket.emit("joinProfesor", email); // Unirse a la sala de profesor
    // Escuchar el evento de WebSocket
    socket.on("mesasActualizadas", (data) => {
      console.log("🔄 Se detectó un cambio en las mesasa:", data);
      fetchMesas(); // Recargar la lista de mesas
    });
    // Limpiar la suscripción cuando el componente se desmonta
    return () => {
      socket.off("mesasActualizadas");
    };
  }, [email]);

  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="mesas-page">
      <h1>Mesas de Examen</h1>
      <ErrorMessage error={error} />
      {!mesasProfesor.length && !mesasColaborador.length ? (
          null
        ) : (
          <div>
            <MesasList mesas={mesasProfesor} title = {'Mesas como Profesor Titular'}/>
            <MesasList mesas={mesasColaborador} title = {'Mesas como Colaborador'}/>
          </div>
        )
      }
      <button onClick={() => navigate('/crear-mesa')} className="create-button">
        Crear Nueva Mesa
      </button>
    </div>
  );
};

export default MesasPage;

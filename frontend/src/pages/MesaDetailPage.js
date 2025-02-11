import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/pages/MesaDetailPage.css';
import '../styles/components/QRScanner.css';
import AlumnosTable from '../components/AlumnosTable';
import ActionButtons from '../components/ActionButtons';
import { getAlumnos, updateAlumno, createAlumno } from '../services/apiService';
import ModalWrapper from '../components/ModalWrapper';
import socket from "../socket"; // Importamos la instancia de WebSockets
import { updateNotasMesa } from "../services/apiService";

const MesasDetailPage = () => {
  const [alumnos, setAlumnos] = useState([]);
  const location = useLocation();
  const { mesa } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notas, setNotas] = useState({});
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
  });

  const [scanResult, setScanResult] = useState(null);

  const openModal = (type, data = null) => setModalState({ type, data });
  const closeModal = () => {
    setModalState({ type: null, data: null });
    fetchAlumnos();
  };

  const handleQRCodeScanned = async (data) => {
    try {
      let message = '';

      const alumnoExistente = alumnos.find(
        (alumno) => alumno.nro_identidad === data.nro_identidad
      );

      if (alumnoExistente) {
        if (alumnoExistente.presente) {
          message = 'El alumno ya se encuentra presente';
        } else {
          // El alumno está inscripto, marcamos como presente
          await updateAlumno(mesa.id_mesa, alumnoExistente.id_estudiante, {
            presente: true,
            inscripto: alumnoExistente.inscripto,
          });
          message = 'Alumno Presente';
        }
      } else {
        await createAlumno({
          doc: 'DNI',
          nro_identidad: data.nro_identidad,
          lu: null,
          nombre_completo: data.nombre_completo,
          carrera: null,
          calidad: null,
          codigo: null,
          plan: null,
          presente: true,
          inscripto: false,
          id_mesa: mesa.id_mesa,
          actualizar_socket: true,
        });
        message = 'El alumno no está inscripto';
      }

      const inscripto = alumnoExistente ? alumnoExistente.inscripto: false;

      setScanResult({
        nombre_completo: data.nombre_completo,
        nro_identidad: data.nro_identidad,
        message: message,
        inscripto: inscripto,
      });

      fetchAlumnos();
    } catch (err) {
      console.error('Error al manejar el código QR:', err.message);
    }
  };

  const handleNotaChange = (id_estudiante, valor) => {
    setNotas((prev) => ({
      ...prev,
      [id_estudiante]: valor,
    }));
  };

  const guardarNotas = async () => {
    const datosNotas = alumnos
      .filter((alumno) => notas[alumno.id_estudiante] !== undefined)
      .map((alumno) => ({
        id_estudiante: alumno.id_estudiante,
        nota: notas[alumno.id_estudiante],
      }));

    if (datosNotas.length === 0) {
      alert("No hay notas para enviar.");
      return;
    }
    try {
      await updateNotasMesa(mesa.id_mesa, datosNotas);
      alert("Notas guardadas correctamente");
    } catch (error) {
      console.error("Error al enviar las notas:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  const fetchAlumnos = async () => {
    try {
      const data = await getAlumnos(mesa.id_mesa);
      setAlumnos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mesa){ 
      fetchAlumnos();
       // Unirse a la sala específica de la mesa de examen
       socket.emit("joinMesa", mesa.id_mesa);

      // Escuchar el evento de WebSocket
      socket.on("datosAlumnosActualizada", (data) => {  
        console.log("🔄 Se detectó un cambio en la mesa:", data);
        if (data.id_mesa === mesa.id_mesa) {
          console.log("🔄 Se detectó un cambio en la mesa:", data);
          fetchAlumnos(); // Recargar la lista de alumnos
        }
      });
    // Limpiar la suscripción cuando el componente se desmonta
    return () => {
      socket.off("datosAlumnosActualizada");
    };
    }
  });


  if (!mesa) return <p>No se encontró información de la mesa.</p>;
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="table-container">
      <h1>Alumnos de la Mesa</h1>
      {alumnos.length > 0 ? (
        <AlumnosTable alumnos={alumnos} openModal={openModal} mesa={mesa} notas = {notas} handleNotaChange = {handleNotaChange} />
      ) : (
        <p>No hay alumnos registrados en esta mesa.</p>
      )}
      <ActionButtons openModal={openModal} guardarNotas={guardarNotas}/>

      <ModalWrapper
        modalState={modalState}
        closeModal={closeModal}
        handleQRCodeScanned={handleQRCodeScanned}
        alumnos={alumnos}
        mesa={mesa}
        alumnoInscripto={scanResult}
      />

  
    </div>
  );
};

export default MesasDetailPage;
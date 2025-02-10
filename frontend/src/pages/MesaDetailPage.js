import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import '../styles/pages/MesaDetailPage.css';
import '../styles/components/QRScanner.css';
import AlumnosTable from '../components/AlumnosTable';
import ActionButtons from '../components/ActionButtons';
import { getAlumnos, updateAlumno, createAlumno } from '../services/apiService';
import ModalWrapper from '../components/ModalWrapper';
import socket from "../socket"; // Importamos la instancia de WebSockets
const MesasDetailPage = () => {
  const [alumnos, setAlumnos] = useState([]);
  const location = useLocation();
  const { mesa } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
  });

  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');

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
      setScanError('');
    } catch (err) {
      console.error('Error al manejar el código QR:', err.message);
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
      // Escuchar el evento de WebSocket
      socket.on("datosAlumnosActualizada", (data) => {
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
  }, [mesa]);


  if (!mesa) return <p>No se encontró información de la mesa.</p>;
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="table-container">
      <h1>Alumnos de la Mesa</h1>
      <button onClick={fetchAlumnos} className="refresh-button">Actualizar Alumnos</button>
      {alumnos.length > 0 ? (
        <AlumnosTable alumnos={alumnos} openModal={openModal} mesa={mesa} />
      ) : (
        <p>No hay alumnos registrados en esta mesa.</p>
      )}
      <ActionButtons openModal={openModal} />

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
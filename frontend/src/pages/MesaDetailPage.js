import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/pages/MesaDetailPage.css';
import AlumnosTable from '../components/AlumnosTable';
import ActionButtons from '../components/ActionButtons';
import ModalWrapper from '../components/ModalWrapper';
import { getAlumnos, updateAlumno, createAlumno } from '../services/apiService';

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

  const openModal = (type, data = null) => setModalState({ type, data });
  const closeModal = () => {
    setModalState({ type: null, data: null });
    fetchAlumnos();
  };

  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      const data = await getAlumnos(mesa.id_mesa);
      setAlumnos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQRCodeScanned = async (data) => {
    try {
      const alumnoExistente = alumnos.find(
        (alumno) => alumno.nro_identidad === data.nro_identidad
      );

      if (alumnoExistente) {
        await updateAlumno(mesa.id_mesa, alumnoExistente.id_estudiante, {
          presente: true,
          inscripto: alumnoExistente.inscripto,
        });
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
      }

      fetchAlumnos();
    } catch (err) {
      console.error('Error al manejar el código QR:', err.message);
    }
  };

  useEffect(() => {
    if (mesa) fetchAlumnos();
  }, [mesa]);

  if (!mesa) return <p>No se encontró información de la mesa.</p>;
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="table-container">
      <h1>Alumnos de la Mesa</h1>
      {alumnos.length > 0 ? (
        <AlumnosTable alumnos={alumnos} openModal={openModal} />
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
      />
    </div>
  );
};

export default MesasDetailPage;

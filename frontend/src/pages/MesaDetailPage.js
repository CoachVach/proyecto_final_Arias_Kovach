import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/MesaDetailPage.css';
import Modal from "../components/common/Modal";
import QRScanner from "../components/QRScanner";
import FileModal from "../components/FileModal";

const MesasDetailPage = () => {
  const [alumnos, setAlumnos] = useState([]);
  const location = useLocation();
  const { mesa } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQRScannerModalOpen, setIsQRScannerModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const openQRScannerModal = () => setIsQRScannerModalOpen(true);
  const closeQRScannerModal = () => setIsQRScannerModalOpen(false);

  const openFileModal = () => setIsFileModalOpen(true);
  const closeFileModal = () => setIsFileModalOpen(false);

  // Function to fetch alumnos by mesaID
  const fetchAlumnos = async (token, mesaID) => {
    try {
      const response = await fetch(`http://localhost:3000/api/alumnos/mesa/${mesaID}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        setAlumnos([]);
        return;
      }

      if (!response.ok) {
        console.error('Error al obtener los alumnos de la mesa');
        throw new Error('Error');
      }

      const data = await response.json();
      setAlumnos(data);  // Update alumnos with the fetched data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle the QR Code scanned
  const handleQRCodeScanned = async (data) => {
    console.log('Código QR escaneado:', data);

    const token = localStorage.getItem('token');
    const alumnoEncontrado = alumnos.find((alumno) => alumno.nro_identidad === data.nro_identidad);

    if (alumnoEncontrado) {
      const response = await fetch(`http://localhost:3000/api/mesas/${mesa.id_mesa}/${alumnoEncontrado.id_estudiante}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          presente: true,
          inscripto: alumnoEncontrado.inscripto,
        }),
      });

      if (!response.ok) {
        console.error('Error al realizar el update del alumno');
        throw new Error('Error');
      }
    } else{
      //Debemos ingresar al alumno a la base de datos para que quede estipulado que se presentó a la mesa sin
      //inscripción previa
      console.log(data.nro_identidad);
      const alumnoResponse = await fetch('http://localhost:3000/api/alumnos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      if (!alumnoResponse.ok) {
        const errorData = await alumnoResponse.json(); // Obtener el mensaje de error
        console.error('Error al realizar el update del alumno:', errorData);
        throw new Error('Error');
      }

    }
      // Refetch alumnos after the update
      fetchAlumnos(token, mesa.id_mesa);
  };

  // Fetch alumnos on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const mesaID = mesa.id_mesa;
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    if (!mesaID) {
      throw new Error('No se encontró el identificador de la mesa');
    }

    fetchAlumnos(token, mesaID);
  }, [mesa.id_mesa]);

  if (!mesa) {
    return <p>No se encontró información de la mesa.</p>;
  }
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="table-container">
      <h1>Alumnos de la Mesa</h1>
      {alumnos.length > 0 ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Inscripto</th>
                <th>Presente</th>
                <th>LU</th>
                <th>Doc</th>
                <th>Número Identidad</th>
                <th>Nombre Completo</th>
                <th>Carrea</th>
                <th>Plan</th>
                <th>Código</th>
                <th>Calidad</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) =>{
                let rowClass ='';
                console.log(alumno);
                if(alumno.inscripto && !alumno.presente ){
                  rowClass = 'row-enrolled-not-present';
                } else if(!alumno.inscripto && alumno.presente){
                  rowClass= 'row-not-enrolled';
                } else if(alumno.inscripto && alumno.presente ){
                  rowClass= 'row-present-enrolled';
                }

                return(
                <tr key={alumno.id_estudiante} className={rowClass}>
                  <td>{alumno.inscripto ? 'Sí' : 'No'}</td>
                  <td>{alumno.presente ? 'Sí' : 'No'}</td>
                  <td>{alumno.lu}</td>
                  <td>{alumno.doc}</td>
                  <td>{alumno.nro_identidad}</td>
                  <td>{alumno.nombre_completo}</td>
                  <td>{alumno.carrera}</td>
                  <td>{alumno.plan}</td>
                  <td>{alumno.codigo}</td>
                  <td>{alumno.calidad}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay alumnos registrados en esta mesa.</p>
      )}
      <button onClick={openQRScannerModal} className="open-modal-button">
        Abrir Escáner
      </button>
      <Modal isOpen={isQRScannerModalOpen} onClose={closeQRScannerModal}>
        <QRScanner onQRCodeScanned={handleQRCodeScanned} />
        <button onClick={closeQRScannerModal}>Cerrar</button>
      </Modal>

      <button onClick={openFileModal} className="open-modal-button">
        Generar Excel
      </button>
      <Modal isOpen={isFileModalOpen} onClose={closeFileModal}>
        <FileModal alumnos={alumnos} onClose={closeFileModal} materia={mesa.materia} fecha={mesa.fecha}/>
      </Modal>

    </div>
  );
};

export default MesasDetailPage;

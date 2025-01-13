import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/MesaDetailPage.css';
import Modal from "../components/common/Modal";
import QRScanner from "../components/QRScanner";

const MesasDetailPage = () =>{
    const [alumnos, setAlumnos] = useState([]);
    const location = useLocation();
    const {mesa} = location.state || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    
    const fetchAlumnos = async (token,mesaID) =>{
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
            setAlumnos(data);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
    };
    const handleQRCodeScanned = async (data) => {
      console.log('Código QR escaneado anashe:', data);
      
      const token = localStorage.getItem('token');
      const alumnoEncontrado = alumnos.find(alumno => alumno.dni === parseInt(data, 10));
      
      console.log('Alumno encontrado', alumnoEncontrado.nombre);
      if (alumnoEncontrado) {
        const response = await fetch(`http://localhost:3000/api/alumnos/${alumnoEncontrado.id_estudiante}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({dni:alumnoEncontrado.dni, lu: alumnoEncontrado.lu, nombre : alumnoEncontrado.nombre, apellido: alumnoEncontrado.apellido, carrera: alumnoEncontrado.carrera, id_mesa: alumnoEncontrado.id_mesa,  presente: true, inscripto: alumnoEncontrado.inscripto}),
        });

        if (!response.ok) {
          console.error('Error al realizar el update del alumno');
          throw new Error('Error');
        }
        fetchAlumnos(token, mesa.id_mesa); 
      } else {
        
      }
    };
   
    useEffect(() => {
      const token = localStorage.getItem('token');
      const mesaID = mesa.id_mesa

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      if (!mesaID) {
        throw new Error('No se encontró el identificador de la mesa');
      }

      fetchAlumnos(token, mesaID);
 
    },[mesa.id_mesa]); // Agrega idMesa como dependencia para reejecutar el efecto si cambia

    if (!mesa) { return <p>No se encontró información de la mesa.</p>;}
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
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>LU</th>
                    <th>DNI</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map((alumno) => (
                    <tr key={alumno.id}>
                      <td>{alumno.inscripto ? 'Sí' : 'No'}</td>
                      <td>{alumno.presente ? 'Sí' : 'No'}</td>
                      <td>{alumno.nombre}</td>
                      <td>{alumno.apellido}</td>
                      <td>{alumno.lu}</td>
                      <td>{alumno.dni}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay alumnos registrados en esta mesa.</p>
          )}
          <button onClick={openModal} className="open-modal-button">
            Abrir Escáner
          </button>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <QRScanner onQRCodeScanned={handleQRCodeScanned}/>
            <button onClick={closeModal}>Cerrar</button>
          </Modal>
        </div>
      );
};

export default MesasDetailPage;
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MesasDetailPage = () =>{
    const [alumnos, setAlumnos] = useState([]);
    const location = useLocation();
    const {mesa} = location.state || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
    useEffect(() => {
        const fetchAlumnos = async () =>{
            try {
                const token = localStorage.getItem('token');
                const mesaID = mesa.id_mesa

                if (!token) {
                  throw new Error('No se encontró el token de autenticación');
                }

                if (!mesaID) {
                  throw new Error('No se encontró el identificador de la mesa');
                }

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
                  console.error('Error al obtener los alumnos de la mesa anashe');
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
        if (mesa.id_mesa) { // Solo ejecuta la consulta si el ID está definido
          fetchAlumnos();
        }    
    },[mesa.id_mesa]); // Agrega idMesa como dependencia para reejecutar el efecto si cambia

    if (!mesa) { return <p>No se encontró información de la mesa.</p>;}
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
  
      return (
        <div>
        <h1>Alumnos de la Mesa</h1>
        {alumnos.length > 0 ? (
          <ul>
            {alumnos.map((alumno) => (
              <li key={alumno.id}>{alumno.inscripto ? 'true' : 'false'}</li>
            ))}
          </ul>
        ) : (
          <p>No hay alumnos registrados en esta mesa.</p>
        )}
      </div>
      );
};

export default MesasDetailPage;
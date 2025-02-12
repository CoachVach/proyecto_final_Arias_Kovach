import React, { useState, useEffect } from 'react';
import { updateUserData, getUserData } from '../services/apiService'; // Importa las funciones desde apiService
import '../styles/pages/UserPage.css';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserPage = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData(); // Usamos la función getUserData desde apiService
        setUser(data);
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        alert('No se pudo obtener los datos del usuario');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserData(formData); // Usamos la función updateUserData desde apiService
      setUser(updatedUser);
      setIsEditing(false);
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      alert('Ocurrió un error al actualizar los datos. Por favor, inténtalo nuevamente.');
    }
  };

  if(loading){
    return <LoadingSpinner/>
  }

  return (
    <div className="user-page">
      <h1>Datos del Usuario</h1>
      {!isEditing ? (
        <div className="user-details">
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Apellido:</strong> {user.apellido}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setIsEditing(true)}>Editar</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="user-form">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={formData.apellido || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
};

export default UserPage;

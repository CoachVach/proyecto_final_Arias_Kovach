import React, { useState, useEffect } from 'react';
import '../styles/UserPage.css';
import Logout from './Logout';

const UserPage = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const response = await fetch('http://localhost:3000/api/profesores', { 
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No autorizado o error al obtener los datos');
        }

        const data = await response.json();
        setUser(data);
        setFormData(data);
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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/profesores`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      alert('Ocurrió un error al actualizar los datos. Por favor, inténtalo nuevamente.');
    }
  };

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
          <label>
            Contraseña (dejar en blanco para no cambiarla):
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancelar
          </button>
        </form>
      )}
    <Logout/>
    </div>
  );
};

export default UserPage;

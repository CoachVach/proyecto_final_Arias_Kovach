import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/Register.css';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    try {
      const response = await fetch('https://proyectofinalariaskovach-production.up.railway.app/api/login/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, password, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registro exitoso. Redirigiendo a inicio de sesión.');
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error al registrar:', err);
    }
  };

  return (
    <div className="register-container">
      <h1>Crear Cuenta</h1>
      <form onSubmit={handleRegister}>
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <label htmlFor="apellido">Apellido</label>
        <input
          type="text"
          id="apellido"
          placeholder="Ingresa tu apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          placeholder="Crea una contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirma tu contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-register">Registrarse</button>
      </form>
      <p className="login-prompt">
        ¿Ya tienes una cuenta?{' '}
        <button onClick={() => navigate('/login')} className="btn-login">
          Inicia Sesión
        </button>
      </p>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado de autenticación

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/api/login/validate-token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setIsAuthenticated(true); // El token es válido
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false); // El token es inválido o expiró
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false); // Si hay error, también se considera inválido
        });
    } else {
      setIsAuthenticated(false); // Si no hay token, no está autenticado
    }
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    try {
      if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false); // Actualizamos el estado de autenticación
        window.location.href = '/login'; // Redirigimos al login
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isAuthenticated === null) {
    return <div>Cargando...</div>; // Pantalla de carga mientras verificamos el token
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Asistencia<span>UNS</span>
        </Link>
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/">Inicio</Link>
          </li>

          {/* Mostrar enlaces si el usuario está logueado */}
          {isAuthenticated && (
            <>
              <li>
                <Link to="/user">Usuario</Link>
              </li>
              <li>
                <Link to="/mesas">Mesas</Link>
              </li>
              <li>
                <Link to="/crear-mesa">Crear Mesa</Link>
              </li>
              <li>
                <Link onClick={handleLogout}>Cerrar Sesión</Link>
              </li>
            </>
          )}

          {/* Mostrar enlaces de Login y Register si el usuario NO está logueado */}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

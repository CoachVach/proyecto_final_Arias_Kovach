import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Verificamos si el usuario está logueado mediante el token en localStorage
  const isLoggedIn = localStorage.getItem('token') ? true : false;

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    try {
      if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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
          {isLoggedIn && (
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
                <Link onClick={handleLogout} >
                  Cerrar Sesión
                  </Link>
              </li>
            </>
          )}

          {/* Mostrar enlaces de Login y Register si el usuario NO está logueado */}
          {!isLoggedIn && (
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

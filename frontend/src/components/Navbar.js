import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Navbar.css';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://proyectofinalariaskovach-production.up.railway.app/api/login/validate-token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    try {
      if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isAuthenticated === null) {
    return <LoadingSpinner/>;
  }

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Asistencia<span>UNS</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu} 
            aria-controls="navbarTogglerDemo02"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarTogglerDemo02">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Inicio
                </Link>
              </li>

              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/user" className="nav-link">
                      Usuario
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/mesas" className="nav-link">
                      Mesas
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/crear-mesa" className="nav-link">
                      Crear Mesa
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/" onClick={handleLogout} className="nav-link">
                      Cerrar Sesión
                    </Link>
                  </li>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;

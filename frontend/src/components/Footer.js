import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          Asistencia<span>UNS</span>
        </div>
        <p>Desarrollado por Erik Kovach y Federico Arias para la UNS, bajo la supervisión de Dr. Martín Larrea y Dr. Luciano Tamargo.</p>
        <ul className="footer-links">
          <li>
            <Link to="/about">Sobre Nosotros</Link>
          </li>
        </ul>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} AsistenciaUNS. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
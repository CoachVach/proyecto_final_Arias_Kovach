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
        <ul className="footer-links">
          <li>
            <Link to="/about">Sobre Nosotros</Link>
          </li>
          <li>
            <Link to="/contact">Contacto</Link>
          </li>
          <li>
            <Link to="/privacy">Política de Privacidad</Link>
          </li>
          <li>
            <Link to="/terms">Términos de Servicio</Link>
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
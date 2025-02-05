import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenidos a la Plataforma de Gestión de Mesas de Exámenes</h1>
      </header>
      <section className="home-description">
        <p>
          Esta plataforma está diseñada para facilitar la gestión de mesas de exámenes para profesores.
          Podrán visualizar, crear y administrar las mesas de exámenes de manera eficiente.
        </p>
        <p>
          Por favor, inicia sesión o regístrate para comenzar a utilizar las funcionalidades de la plataforma.
        </p>
      </section>
    </div>
  );
};

export default Home;

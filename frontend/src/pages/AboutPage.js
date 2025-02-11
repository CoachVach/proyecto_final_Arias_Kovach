import React from 'react';
import '../styles/pages/About.css';

const AboutPage = () => {

  return (
    <div className="about-container">
      <header className="about-header">
        <h1>Sobre Nosotros</h1>
      </header>

      <section className="about-content">
        <p>
          Bienvenidos a la <strong>Plataforma de Gestión de Mesas de Exámenes</strong>, una herramienta diseñada para 
          optimizar la organización y administración de mesas de exámenes académicos.
        </p>
        <p>
          Nuestra misión es proporcionar una solución eficiente para que profesores y colaboradores puedan gestionar 
          exámenes de manera intuitiva y sin complicaciones.
        </p>

        <h2>¿Qué ofrecemos?</h2>
        <ul>
          <li>Creación y administración de mesas de exámenes.</li>
          <li>Asignación de colaboradores y roles.</li>
          <li>Notificaciones en tiempo real sobre cambios en las mesas.</li>
          <li>Una interfaz amigable y fácil de usar.</li>
        </ul>

        <h2>¿Quiénes somos?</h2>
        
        <div className="team-container">
            <div className="team-card">
                <h3>Erik Kovach</h3>
                <p className="email">✉ kovacherik@email.com</p>
                <a href="https://www.linkedin.com/in/erik-kovach-1420b2208/" target="_blank" rel="noopener noreferrer">
                🔗 LinkedIn
                </a>
            </div>

            <div className="team-card">
                <h3>Federico Arias</h3>
                <p className="email">✉ ariasfede596@email.com</p>
                <a href="https://www.linkedin.com/in/federico-arias-09b9a2327/" target="_blank" rel="noopener noreferrer">
                🔗 LinkedIn
                </a>
            </div>
            <p>
          Somos <strong>Erik Kovach</strong> y <strong>Federico Arias</strong>, estudiantes de la 
          <strong> Universidad del Sur</strong>. Esta aplicación fue desarrollada con dedicación y esfuerzo bajo la 
          supervisión de <strong>Dr. Martín Larrea</strong> y <strong>Dr. Luciano Tamargo</strong>.
        </p>
        <p>
          Nuestra motivación es brindar una solución tecnológica eficiente para la comunidad académica, facilitando 
          la gestión de exámenes de manera accesible y organizada.
        </p>
        </div>

        <p>
          Si tienes preguntas o sugerencias, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
        </p>

      </section>
    </div>
  );
};

export default AboutPage;

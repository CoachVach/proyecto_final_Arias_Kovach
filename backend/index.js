// Importar Express
const express = require('express');
const app = express();
const port = 3000;

// Importar Sequelize y los modelos
const sequelize = require('./config/db'); // Tu archivo de configuración de db
const Profesor = require('./models/profesor'); // El modelo de Profesor
const MesaExamen = require('./models/mesa_examen'); // El modelo de MesaExamen

// Ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

// Conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión exitosa con la base de datos');

    // Sincronizar los modelos con la base de datos (crear las tablas si no existen)
    sequelize.sync({ force: false }) // `force: false` no borra las tablas si ya existen
      .then(() => console.log('Tablas sincronizadas con la base de datos'))
      .catch((err) => console.error('Error al sincronizar las tablas:', err));
  })
  .catch((err) => console.error('Error al conectar con la base de datos:', err));

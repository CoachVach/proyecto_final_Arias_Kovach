// Importar Express
const express = require('express');
const app = express();
const port = 3000;

// Ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

const sequelize = require('./db');

sequelize
    .authenticate()
    .then(() => console.log('Conexión exitosa con la base de datos'))
    .catch((err) => console.error('Error al conectar con la base de datos:', err));


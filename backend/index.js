const express = require('express');
const app = express();
const port = 3000;

// Importa Sequelize y modelos desde el archivo central
const { sequelize } = require('./models');

// Middleware de express
app.use(express.json());

// Probar conexión y sincronizar tablas
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión exitosa con la base de datos.');
    return sequelize.sync({ force: false }); // Cambia a `true` para reiniciar las tablas
  })
  .then(() => {
    console.log('Tablas sincronizadas correctamente.');
  })
  .catch((err) => {
    console.error('Error al conectar o sincronizar la base de datos:', err);
  });

// Rutas básicas de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

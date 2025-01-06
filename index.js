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

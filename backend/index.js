const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const { errorMiddleware } = require('./middlewares/errorMiddleware'); // Importar el middleware de manejo de errores


// Importa Sequelize y modelos desde el archivo central
const { sequelize } = require('./models');
//Importamos las rutas de la api
const alumnoRoutes =require('./routes/alumnoRoutes');
const mesa_examenRoutes =require('./routes/mesa_examenRoutes');
const profesorRoutes =require('./routes/profesorRoutes');
const authRoutes = require('./routes/authRoutes');
//Importamos los middlewares
const {verifyToken} = require('./middlewares/authMiddleware');

// Middleware de express
app.use(express.json());
app.use(cors()); //CAMBIAR
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

//Rutas 
app.use('/api/alumnos', verifyToken, alumnoRoutes);
app.use('/api/profesores', verifyToken, profesorRoutes);
app.use('/api/mesas', verifyToken, mesa_examenRoutes);
app.use('/api/login/', authRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});


// Middleware de manejo de errores (colócalo al final)
app.use(errorMiddleware);

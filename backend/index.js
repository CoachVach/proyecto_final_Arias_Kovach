const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http'); // Necesario para WebSockets
const { errorMiddleware } = require('./middlewares/errorMiddleware'); // Middleware de manejo de errores

// Importar Sequelize y modelos desde el archivo central
const { sequelize } = require('./models');

// Importar rutas de la API
const alumnoRoutes = require('./routes/alumnoRoutes');
const mesa_examenRoutes = require('./routes/mesa_examenRoutes');
const profesorRoutes = require('./routes/profesorRoutes');
const authRoutes = require('./routes/authRoutes');

// Importar middlewares
const { verifyToken } = require('./middlewares/authMiddleware');

// Crear aplicación Express
const app = express();
const port = 3000;
const server = http.createServer(app); // Crear servidor HTTP

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Ajusta esto según tu entorno
    methods: ["GET", "POST"]
  }
});

// Middleware de Express
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión exitosa con la base de datos.');
    return sequelize.sync({ force: false }); // Cambia a `true` si necesitas reiniciar las tablas
  })
  .then(() => {
    console.log('Tablas sincronizadas correctamente.');
  })
  .catch((err) => {
    console.error('Error al conectar o sincronizar la base de datos:', err);
  });

// Rutas básicas de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express con WebSockets!');
});

// Configurar Socket.io para manejar conexiones
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Escuchar eventos de actualización de mesas
  socket.on('updateDetaisAlumnos', (data) => {
    io.emit('datosAlumnosActualizada', data); // Enviar actualización a todos los clientes conectados
  });

  // Escuchar eventos de actualización de mesas
  socket.on('updateMesasColaboradores', (data) => {
    io.emit('mesasParaColabActualizadas', data); // Enviar actualización a todos los clientes conectados
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Pasar la instancia de `io` a las rutas
app.use('/api/alumnos', verifyToken, alumnoRoutes);
app.use('/api/profesores', verifyToken, profesorRoutes);
app.use('/api/mesas', (req, res, next) => {
  req.io = io; // Agregar `io` a la request
  next();
}, verifyToken, mesa_examenRoutes);


app.use('/api/login/', authRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

// Iniciar el servidor en el puerto definido
server.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

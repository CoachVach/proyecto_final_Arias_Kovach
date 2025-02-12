const express = require('express');
const cors = require('cors'); // 
const { Server } = require('socket.io');
const http = require('http'); 
const { errorMiddleware } = require('./middlewares/errorMiddleware'); 
// Importar Sequelize y modelos desde el archivo central
const { sequelize } = require('./models');
// Importar rutas API
const alumnoRoutes = require('./routes/alumnoRoutes');
const mesa_examenRoutes = require('./routes/mesa_examenRoutes');
const profesorRoutes = require('./routes/profesorRoutes');
const authRoutes = require('./routes/authRoutes');
// Importar middlewares
const { verifyToken } = require('./middlewares/authMiddleware');
//Creamos la app con Express
const app = express();
const port = process.env.PORT || 3000; 
const server = http.createServer(app); 
// Configuramos los Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: '*',
  },
});

// Puesta en marcha del Middleware
app.use(express.json());
app.use(cors()); 

// Connect to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión exitosa con la base de datos.');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('Tablas sincronizadas correctamente.');
  })
  .catch((err) => {
    console.error('Error al conectar o sincronizar la base de datos:', err);
  });

// Tester básico 
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express con WebSockets!');
});

// Configuración de los sockets para las conexiones entre distintos usuarios en tiempor real
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Escuchamos los eventos para actualizar los datos del estudiante
  socket.on('updateDetailsAlumnos', (data) => {
    io.emit('datosAlumnosActualizada', data); // Send update to all connected clients
  });

  // Escuchamos los eventos para las listas compartidas de mesas entre distintos usuarios en tiempo real
  socket.on('updateListaMesas', (data) => {
    io.emit('mesasActualizadas', data);
  });

  // Nos unimos a una sala específica por mesa
  socket.on('joinMesa', (id_mesa) => {
    console.log(`📌 Usuario ${socket.id} se unió a la mesa ${id_mesa}`);
    socket.join(`mesa_${id_mesa}`);
  });

  // Nos unimos a una sala específica independiente para cada profesor
  socket.on('joinProfesor', (email) => {
    socket.join(`profesor_${email}`);
    console.log(`👨‍🏫 Profesor ${email} unido a su sala`);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

//Rutas
app.use('/api/profesores', verifyToken, profesorRoutes);
app.use('/api/login/', authRoutes);
// Pasamos una instancia `io` para las rutas que la necesitan
app.use('/api/alumnos', (req, res, next) => {
  req.io = io; 
  next();
}, verifyToken, alumnoRoutes);
app.use('/api/mesas', (req, res, next) => {
  req.io = io; 
  next();
}, verifyToken, mesa_examenRoutes);

// Menejo de los errores. 
app.use(errorMiddleware);

// Corremos el servidor
server.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${port}`);
});
const express = require('express');
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
const port = process.env.DB_PORT;

const server = http.createServer(app); // Crear servidor HTTP

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // 🔥 Permite TODO
    methods: ['GET', 'POST'],
    allowedHeaders: '*',
  },
});

// Elimina cualquier middleware relacionado con CORS
// app.use(cors({ origin: '*' }));
// Elimina los headers manuales, ya no es necesario.

app.use(express.json());

// Conectar a la base de datos
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

// Rutas básicas de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express con WebSockets!');
});

// Configurar Socket.io para manejar conexiones
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Escuchar eventos de actualización de mesas
  socket.on('updateDetailsAlumnos', (data) => {
    io.emit('datosAlumnosActualizada', data); // Enviar actualización a todos los clientes conectados
  });
  
  socket.on("joinMesa", (id_mesa) => {
    console.log(`📌 Usuario ${socket.id} se unió a la mesa ${id_mesa}`);
    socket.join(`mesa_${id_mesa}`);
  });
  
  socket.on("joinProfesor", (email) => {
    socket.join(`profesor_${email}`);
    console.log(`👨‍🏫 Profesor ${email} unido a su sala`);
  });

  socket.on('updateListaMesas', (data) => {
    io.emit('mesasActualizadas', data);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Pasar la instancia de `io` a las rutas
app.use('/api/alumnos', (req, res, next) => {
  req.io = io;
  next();
}, verifyToken, alumnoRoutes);
app.use('/api/profesores', verifyToken, profesorRoutes);
app.use('/api/mesas', (req, res, next) => {
  req.io = io;
  next();
}, verifyToken, mesa_examenRoutes);

app.use('/api/login/', authRoutes);

// Middleware de manejo de errores
app.use(errorMiddleware);

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor ejecutándose en ${port}`);
});

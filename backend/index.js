const express = require('express');
const cors = require('cors'); // ✅ Import the cors module
const { Server } = require('socket.io');
const http = require('http'); // Necessary for WebSockets
const { errorMiddleware } = require('./middlewares/errorMiddleware'); // Error handling middleware

// Import Sequelize and models from the central file
const { sequelize } = require('./models');

// Import API routes
const alumnoRoutes = require('./routes/alumnoRoutes');
const mesa_examenRoutes = require('./routes/mesa_examenRoutes');
const profesorRoutes = require('./routes/profesorRoutes');
const authRoutes = require('./routes/authRoutes');

// Import middlewares
const { verifyToken } = require('./middlewares/authMiddleware');

// Create Express application
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

const server = http.createServer(app); // Create HTTP server

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: '*',
  },
});

// Middleware setup
app.use(express.json());
app.use(cors()); // ✅ Enable CORS middleware

// Connect to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Conexión exitosa con la base de datos.');
    return sequelize.sync({ force: false }); // Change to `true` if you need to reset the tables
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas correctamente.');
  })
  .catch((err) => {
    console.error('❌ Error al conectar o sincronizar la base de datos:', err);
  });

// Basic test route
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express con WebSockets!');
});

// Configure Socket.io to handle connections
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Listen for events to update student details
  socket.on('updateDetailsAlumnos', (data) => {
    io.emit('datosAlumnosActualizada', data); // Send update to all connected clients
  });

  // Join a specific room when a user enters a table
  socket.on('joinMesa', (id_mesa) => {
    console.log(`📌 Usuario ${socket.id} se unió a la mesa ${id_mesa}`);
    socket.join(`mesa_${id_mesa}`); // The user joins the specific table room
  });

  // Join professor to their personal room
  socket.on('joinProfesor', (email) => {
    socket.join(`profesor_${email}`);
    console.log(`👨‍🏫 Profesor ${email} unido a su sala`);
  });

  // Listen for events to update the list of tables
  socket.on('updateListaMesas', (data) => {
    io.emit('mesasActualizadas', data); // Send update to all connected clients
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Pass the `io` instance to the routes if needed
app.use('/api/alumnos', (req, res, next) => {
  req.io = io; // Add `io` to the request
  next();
}, verifyToken, alumnoRoutes);

app.use('/api/profesores', verifyToken, profesorRoutes);

app.use('/api/mesas', (req, res, next) => {
  req.io = io; // Add `io` to the request
  next();
}, verifyToken, mesa_examenRoutes);

app.use('/api/login/', authRoutes);

// Error handling middleware (should go at the end)
app.use(errorMiddleware);

// Start the server on the defined port
server.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${port}`);
});
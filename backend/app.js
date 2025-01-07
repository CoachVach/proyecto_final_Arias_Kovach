const express = require('express');
const bodyParser = require('body-parser');
const profesorRoutes = require('./routes/profesorroutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/profesores', profesorRoutes);

module.exports = app;

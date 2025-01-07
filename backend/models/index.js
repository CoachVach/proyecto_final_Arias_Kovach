//Este archivo se encarga de importar todos los modelos de la aplicación

const sequelize = require('../db'); // Importa la configuración de db.js
const { Sequelize } = require('sequelize');

// Cargar modelos (puedes usar un patrón dinámico para cargar automáticamente)
const Attendance = require('./attendance');
//Esto es a modo de ejemplo, se deben cambiar por los modelos reales
const db = {
    sequelize,
    Sequelize,
    Attendance,
};

// Sincroniza los modelos con la base de datos
db.sequelize
    .sync({ alter: true }) // Cambia a { force: true } para borrar y recrear tablas (destructivo)
    .then(() => console.log('Tablas sincronizadas con la base de datos'))
    .catch((err) => console.error('Error al sincronizar las tablas:', err));

module.exports = db;

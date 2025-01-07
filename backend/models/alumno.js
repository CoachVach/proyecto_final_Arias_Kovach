// models/Estudiante.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Estudiante = sequelize.define('Estudiante', {
  id_estudiante: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  lu: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // LU único para cada estudiante
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carrera: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Estudiante',
  timestamps: false,
});

// Relación muchos a muchos con MesaExamen a través de MesaEstudiante
Estudiante.belongsToMany(require('./MesaExamen'), {
  through: require('./MesaEstudiante'),
  foreignKey: 'id_estudiante',
  otherKey: 'id_mesa',
});

module.exports = Estudiante;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const alumno = sequelize.define('alumno', {
  id_estudiante: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  lu: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  tableName: 'alumno',
  timestamps: false,
});

module.exports = alumno;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Alumno = sequelize.define('alumno', {
  id_estudiante: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dni: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  lu: {
    type: DataTypes.STRING,
    allowNull: true,
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
    allowNull: true,
  },
}, {
  tableName: 'alumno',
  timestamps: false,
});

module.exports = Alumno;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const alumno = sequelize.define('alumno', {
  id_estudiante: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dni: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lu: {
    type: DataTypes.STRING,
    allowNull: true,
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
  id_mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  presente: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  inscripto: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'alumno',
  timestamps: false,
});

module.exports = alumno;

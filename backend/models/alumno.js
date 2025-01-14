const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Alumno = sequelize.define('alumno', {
  id_estudiante: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  doc: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nro_identidad: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  lu: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  nombre_completo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'alumno',
  timestamps: false,
});

module.exports = Alumno;

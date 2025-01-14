const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MesaAlumno = sequelize.define('mesa_alumno', {
  id_mesa_alumno: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  tableName: 'mesa_alumno',
  timestamps: false,
});

module.exports = MesaAlumno;

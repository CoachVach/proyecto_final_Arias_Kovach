const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const mesa_alumno = sequelize.define('mesa_alumno', {
  id_mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'mesa_alumno',
  timestamps: false,
});

module.exports = mesa_alumno;

// models/MesaEstudiante.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MesaEstudiante = sequelize.define('MesaEstudiante', {
  id_mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'MesaExamen',
      key: 'id_mesa',
    },
  },
  id_estudiante: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Estudiante',
      key: 'id_estudiante',
    },
  },
}, {
  tableName: 'MesaEstudiante',
  timestamps: false,
});

module.exports = MesaEstudiante;

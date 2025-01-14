const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MesaExamen = sequelize.define('mesa_examen', {
  id_mesa: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  materia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_profesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'mesa_examen',
  timestamps: false,
});

module.exports = MesaExamen;

// models/MesaExamen.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MesaExamen = sequelize.define('MesaExamen', {
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
    references: {
      model: 'Profesor',
      key: 'id_profesor',
    },
  },
}, {
  tableName: 'MesaExamen',
  timestamps: false,
});

// Relación muchos a muchos con Estudiante a través de MesaEstudiante
MesaExamen.belongsToMany(require('./Estudiante'), {
  through: require('./MesaEstudiante'),
  foreignKey: 'id_mesa',
  otherKey: 'id_estudiante',
});

module.exports = MesaExamen;

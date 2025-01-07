const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Profesor = require('./profesor'); // Asumimos que ya tienes el modelo de Profesor

const MesaExamen = sequelize.define('MesaExamen', {
  id_mesa: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_mesa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  id_profesor: {
    type: DataTypes.INTEGER,
    references: {
      model: Profesor, // Relación con el modelo Profesor
      key: 'id_profesor',
    },
    allowNull: false,
  },
  materia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  aula: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'MesaExamen',
  timestamps: false,
});

// Relación con Profesor (un profesor puede tener muchas mesas de examen)
MesaExamen.belongsTo(Profesor, { foreignKey: 'id_profesor' });
Profesor.hasMany(MesaExamen, { foreignKey: 'id_profesor' });

module.exports = MesaExamen;

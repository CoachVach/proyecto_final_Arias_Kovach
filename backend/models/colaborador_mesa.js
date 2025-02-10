const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ColaboradorMesa = sequelize.define('colaborador_mesa', {
  id_colaborador_mesa: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_profesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_mesa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'colaborador_mesa',
  timestamps: false,
});

module.exports = ColaboradorMesa;

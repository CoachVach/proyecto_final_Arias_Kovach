const sequelize = require('../config/db');
const alumno = require('./alumno');
const profesor = require('./profesor');
const mesa_examen = require('./mesa_examen');

// Relaciones
profesor.hasMany(mesa_examen, {
  foreignKey: 'id_profesor',
});
mesa_examen.belongsTo(profesor, {
  foreignKey: 'id_profesor',
});
mesa_examen.hasMany(alumno, {
  foreignKey: 'id_mesa',
});
alumno.belongsTo(mesa_examen, {
  foreignKey: 'id_mesa',
});

module.exports = {
  sequelize,
  alumno,
  profesor,
  mesa_examen,
};

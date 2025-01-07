const sequelize = require('../config/db');
const alumno = require('./alumno');
const profesor = require('./profesor');
const mesa_examen = require('./mesa_examen');
const mesa_alumno = require('./mesa_alumno');

// Relaciones
profesor.hasMany(mesa_examen, {
  foreignKey: 'id_profesor',
});
mesa_examen.belongsTo(profesor, {
  foreignKey: 'id_profesor',
});

alumno.belongsToMany(mesa_examen, {
  through: mesa_alumno,
  foreignKey: 'id_estudiante',
  otherKey: 'id_mesa',
});
mesa_examen.belongsToMany(alumno, {
  through: mesa_alumno,
  foreignKey: 'id_mesa',
  otherKey: 'id_estudiante',
});

module.exports = {
  sequelize,
  alumno,
  profesor,
  mesa_examen,
  mesa_alumno,
};

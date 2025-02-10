const sequelize = require('../config/db');
const alumno = require('./alumno');
const profesor = require('./profesor');
const mesa_examen = require('./mesa_examen');
const mesa_alumno = require('./mesa_alumno');
const colaborador_mesa = require('./colaborador_mesa');

// Relaciones
profesor.hasMany(mesa_examen, {
  foreignKey: 'id_profesor',
});
mesa_examen.belongsTo(profesor, {
  foreignKey: 'id_profesor',
});

// Relación muchos a muchos entre mesa_examen y alumno
mesa_examen.belongsToMany(alumno, {
  through: mesa_alumno,
  foreignKey: 'id_mesa',
  otherKey: 'id_estudiante',
});

alumno.belongsToMany(mesa_examen, {
  through: mesa_alumno,
  foreignKey: 'id_estudiante',
  otherKey: 'id_mesa',
});

// Relación muchos a muchos entre mesa_examen y alumno
mesa_examen.belongsToMany(profesor, {
  through: colaborador_mesa,
  foreignKey: 'id_mesa',
  otherKey: 'id_profesor',
});

profesor.belongsToMany(mesa_examen, {
  through: colaborador_mesa,
  foreignKey: 'id_profesor',
  otherKey: 'id_mesa',
});


module.exports = {
  sequelize,
  alumno,
  profesor,
  mesa_examen,
  mesa_alumno,
  colaborador_mesa,
};

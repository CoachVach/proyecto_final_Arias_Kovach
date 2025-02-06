const cron = require('node-cron');
const sequelize = require('../config/db');
const { Op } = require('sequelize');
const MesaAlumno = require('../models/mesa_alumno');
const MesaExamen = require('../models/mesa_examen');
const Alumno = require('../models/alumno');

const cleanOldExams = async () => {
    console.log('[CRON JOB] Ejecutando limpieza de mesas de examen y alumnos...');

    try {
        await sequelize.authenticate();
        console.log('[CRON JOB] Conexión a la base de datos exitosa.');

        // Eliminar mesas de examen antiguas
        const result = await MesaExamen.destroy({
            where: {
                fecha: {
                    [Op.lt]: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 días atrás
                }
            }
        });

        console.log('[CRON JOB] Registros de mesas de examen eliminados:', result);

        // Paso 1: Encontrar IDs de alumnos que tienen registros en MesaAlumno
        const alumnosConMesaAlumno = await MesaAlumno.findAll({
            attributes: ['id_estudiante'],
            group: ['id_estudiante']
        });

        const alumnosConMesaAlumnoIDs = alumnosConMesaAlumno.map(ma => ma.id_estudiante);

        // Paso 2: Encontrar alumnos que NO tienen registros en MesaAlumno
        const alumnosAEliminar = await Alumno.findAll({
            where: {
                id_estudiante: {
                    [Op.notIn]: alumnosConMesaAlumnoIDs
                }
            }
        });

        // Paso 3: Eliminar los alumnos encontrados
        const alumnosEliminados = await Alumno.destroy({
            where: {
                id_estudiante: {
                    [Op.in]: alumnosAEliminar.map(alumno => alumno.id_estudiante)
                }
            }
        });

        console.log('[CRON JOB] Alumnos eliminados correctamente:', alumnosEliminados);

    } catch (error) {
        console.error('[CRON JOB] Error eliminando registros:', error);
    }
};

cron.schedule('0 0 * * *', cleanOldExams, {
    scheduled: true,
    timezone: "America/Argentina/Buenos_Aires"
});

module.exports = cleanOldExams;
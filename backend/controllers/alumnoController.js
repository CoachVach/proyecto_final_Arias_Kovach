const AlumnoService = require('../services/alumnoService');
const Alumno = require('../models/alumno');
const MesaAlumno = require('../models/alumno');
const MesaExamenService = require('../services/mesaExamenService');
const MesaAlumnoService = require('../services/mesaAlumnoService');
const AppError  = require('../structure/AppError');

const getAlumnosByIdMesaExamen = async (req, res, next) => {
    try {
        const idMesa = req.params.id;
        const result = await AlumnoService.getAlumnosByIdMesaExamen(idMesa, req.profesor.id_profesor);
        res.status(200).json(result);
    } catch (error) {
        console.log('AppError:', AppError);
        next(error instanceof AppError ? error : new AppError('Error al obtener el conjunto de alumnos', 500, error.message));
    }
};

const createAlumno = async (req, res, next) => {
    try {
        const { doc, nro_identidad, lu, nombre_completo } = req.body;
        const newAlumno = await AlumnoService.createAlumno(doc, nro_identidad, lu, nombre_completo);
        res.status(201).json(newAlumno);
    } catch (error) {
        next(new AppError('Error al crear el alumno', 400, error.message));
    }
};

const assignAlumnoToMesa = async (req, res, next) => {
    try {
        const { doc, nro_identidad, lu, nombre_completo, carrera, calidad, codigo, plan, presente, inscripto, id_mesa, actualizar_socket } = req.body;

        if (!nro_identidad || !id_mesa) {
            throw new AppError('El DNI y el ID de la mesa son obligatorios', 400);
        }

        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, id_mesa);

        let alumno = await AlumnoService.findAlumnoByNroIden(nro_identidad);
        console.log(actualizar_socket);
        if(actualizar_socket){
            const sala = `mesa_${mesa.id_mesa}`
            req.io.to(sala).emit('datosAlumnosActualizada', { id_mesa: mesa.id_mesa });
        }

        if (!alumno) {
            alumno = await AlumnoService.createAlumno(doc, nro_identidad, lu, nombre_completo);
            await MesaExamenService.assingAlumnoToMesa(alumno, mesa, carrera, calidad, codigo, plan, presente, inscripto, actualizar_socket);
            return res.status(201).json({ message: 'Alumno creado y asignado a la mesa', alumno });
        }

        let isInMesa =  await MesaAlumnoService.verifyAlumnoIsInMesa(id_mesa, alumno.id_estudiante);
        if(isInMesa){
            throw new AppError('El alumno ya está asignado a esta mesa', 409);
        }
        
        await MesaExamenService.assingAlumnoToMesa(alumno, mesa, carrera, calidad, codigo, plan, presente, inscripto, actualizar_socket);

        res.status(200).json({ message: 'Alumno asignado a la mesa correctamente', alumno });
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al asignar el alumno a la mesa', 500, error.message));
    }
};

const assignAlumnosToMesa = async (req, res, next) => {
    try {
        const { alumnos, id_mesa } = req.body;

        if (!Array.isArray(alumnos) || alumnos.length === 0) {
            throw new AppError('La lista de alumnos está vacía o no es válida', 400);
        }

        if (!id_mesa) {
            throw new AppError('El ID de la mesa es obligatorio', 400);
        }

        // Validate the mesa once
        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, id_mesa);

        const results = [];
        for (const alumnoData of alumnos) {
            const { doc, nro_identidad, lu, nombre_completo, carrera, calidad, codigo, plan, presente, inscripto } = alumnoData;

            if (!nro_identidad) {
                throw new AppError('El DNI es obligatorio para cada alumno', 400);
            }

            let alumno = await AlumnoService.findAlumnoByNroIden(nro_identidad);

            if (!alumno) {
                alumno = await AlumnoService.createAlumno(doc, nro_identidad, lu, nombre_completo);
                await MesaExamenService.assingAlumnoToMesa(alumno, mesa, carrera, calidad, codigo, plan, presente, inscripto, false);
                results.push({ message: 'Alumno creado y asignado a la mesa', alumno });
            } else {
                await MesaExamenService.assingAlumnoToMesa(alumno, mesa, carrera, calidad, codigo, plan, presente, inscripto, false);
                results.push({ message: 'Alumno asignado a la mesa correctamente', alumno });
            }
        }

        res.status(200).json(results);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al asignar los alumnos a la mesa', 500, error.message));
    }
};

module.exports = {
    getAlumnosByIdMesaExamen,
    createAlumno,
    assignAlumnoToMesa,
    assignAlumnosToMesa,
};

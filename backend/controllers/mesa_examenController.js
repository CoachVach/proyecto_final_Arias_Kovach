const AlumnoService = require('../services/alumnoService');
const MesaExamenService = require('../services/mesaExamenService');
const MesaAlumnoService = require('../services/mesaAlumnoService');
const ColaboradorMesaService = require('../services/colaboradorMesaService');
const AppError  = require('../structure/AppError');

const getAllMesas = async (req, res, next) => {
    try {
        const mesas = await MesaExamenService.getAllMesas();
        res.status(200).json(mesas);
    } catch (error) {
        next(new AppError('Error al obtener las mesas de examen', 500, error.message));
    }
};

const getMesaById = async (req, res, next) => {
    try {
        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, req.params.id);
        res.status(200).json(mesa);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al obtener la mesa de examen', 500, error.message));
    }
};

const createMesa = async (req, res, next) => {
    try {
        const { fecha, materia, listaColaboradores } = req.body;
        if (!fecha || !materia) {
            throw new AppError('Fecha y materia son requeridos', 400);
        }
        const newMesa = await MesaExamenService.createMesaExamen(fecha, materia, req.profesor.id_profesor);
        if (!listaColaboradores || !Array.isArray(listaColaboradores)) {
            await MesaExamenService.deleteMesa(newMesa);
            throw new AppError('Formato incorrecto de datos', 400);
        }
        await ColaboradorMesaService.addColaborador(listaColaboradores, newMesa.id_mesa,req.io);
        res.status(201).json(newMesa);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al crear la mesa de examen', 500, error.message));
    }
};

const updateMesa = async (req, res, next) => {
    try {
        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, req.params.id);
        const { fecha, materia, id_profesor } = req.body;

        await MesaExamenService.updateMesaExamen(mesa, fecha, materia, id_profesor);
        res.status(200).json(mesa);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al actualizar la mesa de examen', 400, error.message));
    }
};

const updateAlumnoMesa = async (req, res, next) => {
    try {
        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, req.params.id_mesa);
        const alumno = await AlumnoService.findAlumnoById(req.params.id_estudiante);
        const { presente } = req.body;

        await MesaAlumnoService.updatePresentAlumno(alumno.id_estudiante, mesa.id_mesa, presente);
        // Emitir evento de actualización a todos los clientes
        const sala = `mesa_${mesa.id_mesa}`;
        req.io.to(sala).emit('datosAlumnosActualizada', { id_mesa: mesa.id_mesa });
        res.status(200).json(mesa);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al actualizar la mesa de examen', 400, error.message));
    }
};

const updateDatosAlumnoMesa = async (req, res, next) => {
    try {
        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, req.params.id_mesa);
        const alumno = await AlumnoService.findAlumnoById(req.params.id_estudiante);
        const { presente, inscripto, carrera, plan, codigo, calidad } = req.body;

        await MesaAlumnoService.updateDatosAlumno(
            alumno.id_estudiante,
            mesa.id_mesa,
            presente,
            inscripto,
            carrera,
            plan,
            codigo,
            calidad
        );
        // Emitir evento de actualización a todos los clientes
        const sala = `mesa_${mesa.id_mesa}`;
        req.io.to(sala).emit('datosAlumnosActualizada', { id_mesa: mesa.id_mesa });
        res.status(200).json(mesa);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al actualizar la mesa de examen', 400, error.message));
    }
};

const deleteMesa = async (req, res, next) => {
    try {
        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, req.params.id);
        await MesaExamenService.deleteMesa(mesa);
        res.status(200).json({ message: 'Mesa de examen eliminada correctamente' });
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al eliminar la mesa de examen', 500, error.message));
    }
};

const getMesaByProfesor = async (req, res, next) => {
    try {
        const mesas = await MesaExamenService.findMesasByProfesor(req.profesor.id_profesor);
        res.status(200).json(mesas);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al obtener las mesas de examen', 500, error.message));
    }
};

const getMesaByColaborador = async (req, res, next) => {
    try {
        const mesas = await ColaboradorMesaService.findMesasByColaborador(req.profesor.id_profesor);
        res.status(200).json(mesas);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al obtener las mesas de examen', 500, error.message));
    }
};


const updateNotasAlumnos = async (req, res, next) => {
    try {
        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, req.params.id_mesa);
        const {notasById} = req.body;
        if (!notasById || !Array.isArray(notasById)) {
            throw new AppError('Formato incorrecto de datos', 400);
        }
        
        await MesaAlumnoService.updateNotasAlumnos(mesa.id_mesa, notasById);
        // Emitir evento de actualización a todos los clientes
        const sala = `mesa_${mesa.id_mesa}`;
        req.io.to(sala).emit('datosAlumnosActualizada', { id_mesa: mesa.id_mesa });
        res.status(200).json({ message: 'Notas de los alumnos actualizadas correctamente' });
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al actualizar la nota del alumno', 500, error.message));
    }
};

module.exports = {
    getAllMesas,
    getMesaById,
    createMesa,
    updateMesa,
    deleteMesa,
    getMesaByProfesor,
    updateAlumnoMesa,
    updateDatosAlumnoMesa,
    updateNotasAlumnos,
    getMesaByColaborador
};

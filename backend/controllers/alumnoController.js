const AlumnoService = require('../services/alumnoService');
const Alumno = require('../models/alumno');
const MesaExamenService = require('../services/mesaExamenService');
const MesaAlumnoService = require('../services/mesaAlumnoService');
const AppError  = require('../structure/AppError');

const getAllAlumnos = async (req, res, next) => {
    try {
        const alumnos = await AlumnoService.findAllAlumnos();
        res.status(200).json(alumnos);
    } catch (error) {
        next(new AppError('Error al obtener los alumnos', 500, error.message));
    }
};

const getAlumnoById = async (req, res, next) => {
    try {
        const alumno = await AlumnoService.findAlumnoById(req.params.id);
        res.status(200).json(alumno);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al obtener el alumno', 500, error.message));
    }
};

const getAlumnosByIdMesaExamen = async (req, res, next) => {
    try {
        const idMesa = req.params.id;
        /*
        await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, idMesa);
        const mesaAlumnosData = await AlumnoService.findAlumnosDataFromMesaAlumno(idMesa);
        const estudiantesIds = mesaAlumnosData.map((ed) => ed.id_estudiante);
        const alumnos = await AlumnoService.findAllAlumnos(estudiantesIds);
        const result = await AlumnoService.mapAlumnosDataWithMesaAlumnos(alumnos, mesaAlumnosData);*/
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
        console.log("ANASHE");
        console.log(alumnos.length);

        if (!Array.isArray(alumnos) || alumnos.length === 0) {
            throw new AppError('La lista de alumnos está vacía o no es válida', 400);
        }

        if (!id_mesa) {
            throw new AppError('El ID de la mesa es obligatorio', 400);
        }

        console.log("Validar mesa");
        const mesa = await MesaExamenService.validateProfesorMesa(req.profesor.id_profesor, id_mesa);

        // Filter out existing students to avoid duplicates
        const existingAlumnos = await Alumno.findAll({
            where: {
                nro_identidad: alumnos.map(alumno => alumno.nro_identidad)
            }
        });
        console.log(existingAlumnos.length);

        const existingNroIdentidad = existingAlumnos.map(alumno => alumno.nro_identidad);
        const newAlumnos = alumnos.filter(alumno => !existingNroIdentidad.includes(alumno.nro_identidad));

        // Bulk insert new students
        if (newAlumnos.length > 0) {
            console.log("CREAR");
            await Alumno.bulkCreate(newAlumnos.map(alumno => ({
                doc: alumno.doc,
                nro_identidad: alumno.nro_identidad,
                lu: alumno.lu,
                nombre_completo: alumno.nombre_completo
            })));
        }

        // Assign all students to the mesa
        console.log("TODOS");
        const allAlumnos = await Alumno.findAll({
            where: {
                nro_identidad: alumnos.map(alumno => alumno.nro_identidad)
            }
        });

        const mesaAlumnoData = allAlumnos.map(alumno => ({
            id_estudiante: alumno.id_estudiante,
            id_mesa: id_mesa,
            carrera: alumno.carrera,
            calidad: alumno.calidad,
            codigo: alumno.codigo,
            plan: alumno.plan,
            presente: alumno.presente,
            inscripto: alumno.inscripto
        }));

        // Bulk insert into MesaAlumno
        await MesaAlumno.bulkCreate(mesaAlumnoData);

        res.status(200).json({ message: 'Alumnos asignados a la mesa correctamente' });
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al asignar los alumnos a la mesa', 500, error.message));
    }
};

const updateAlumno = async (req, res, next) => {
    try {
        const alumno = await AlumnoService.findAlumnoById(req.params.id);

        const { doc, nro_identidad, lu, nombre_completo } = req.body;
        await AlumnoService.updateAlumno(alumno, doc, nro_identidad, lu, nombre_completo);

        res.status(200).json(alumno);
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al actualizar el alumno', 400, error.message));
    }
};

const deleteAlumno = async (req, res, next) => {
    try {
        const alumno = await AlumnoService.findAlumnoById(req.params.id);
        await AlumnoService.deleteAlumno(alumno);
        res.status(200).json({ message: 'Alumno eliminado correctamente' });
    } catch (error) {
        next(error instanceof AppError ? error : new AppError('Error al eliminar el alumno', 500, error.message));
    }
};

module.exports = {
    getAllAlumnos,
    getAlumnoById,
    getAlumnosByIdMesaExamen,
    createAlumno,
    assignAlumnoToMesa,
    assignAlumnosToMesa,
    updateAlumno,
    deleteAlumno,
};

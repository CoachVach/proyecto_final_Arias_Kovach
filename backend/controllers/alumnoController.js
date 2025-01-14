const Alumno = require('../models/alumno');
const Profesor = require('../models/profesor');
const MesaAlumno = require('../models/mesa_alumno');
const MesaExamen = require('../models/mesa_examen');

const getAllAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.findAll({ include: { model: MesaExamen, through: MesaAlumno } });
        res.status(200).json(alumnos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los alumnos' });
    }
};

const getAlumnoById = async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id, { include: { model: MesaExamen, through: MesaAlumno } });
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el alumno' });
    }
};

const getAlumnosByIdMesaExamen = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
            return res.status(403).json({ message: 'No se proporcionó un token de autenticación' });
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1])); 
        const email = decodedToken.email;
        const profesor = await Profesor.findOne({ where: { email } });
        if (!profesor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        const idMesa = req.params.id;

        const mesaAlumnos = await MesaAlumno.findAll({
            where: { id_mesa: idMesa },
            attributes: ['id_estudiante', 'inscripto', 'presente'], // Incluye atributos específicos
        });

        if (!mesaAlumnos || mesaAlumnos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron estudiantes para esta mesa' });
        }

        // Extrae los IDs de estudiantes y agrega atributos de inscripto y presente
        const estudiantesData = mesaAlumnos.map(ma => ({
            id_estudiante: ma.id_estudiante,
            inscripto: ma.inscripto,
            presente: ma.presente
        }));

        const estudiantesIds = estudiantesData.map(ed => ed.id_estudiante);

        const alumnos = await Alumno.findAll({
            where: {
                id_estudiante: estudiantesIds, 
            },
            attributes: ['id_estudiante', 'nombre', 'apellido', 'lu', 'dni'], // Ajusta según los atributos de Alumno
        });

        if (!alumnos || alumnos.length === 0) {
            return res.status(404).json({ error: 'Alumnos no encontrados' });
        }

        // Combina los datos de los alumnos con los datos de inscripto/presente
        const result = alumnos.map(alumno => {
            const alumnoData = estudiantesData.find(ed => ed.id_estudiante === alumno.id_estudiante);
            return {
                ...alumno.toJSON(),
                inscripto: alumnoData.inscripto,
                presente: alumnoData.presente,
            };
        });

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el conjunto de alumnos' });
    }
};

const createAlumno = async (req, res) => {
    try {
        const { dni, lu, nombre, apellido, carrera } = req.body;
        const newAlumno = await Alumno.create({ dni, lu, nombre, apellido, carrera });
        res.status(201).json(newAlumno);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el alumno', details: error });
    }
};

const assignAlumnoToMesa = async (req, res) => {
    try {
        const { dni, lu, nombre, apellido, carrera, presente, inscripto, id_mesa} = req.body;

        // Validar los campos obligatorios
        if (!dni || !id_mesa) {
            return res.status(400).json({ error: 'El DNI y el ID de la mesa son obligatorios' });
        }

        // Buscar la mesa
        const mesa = await MesaExamen.findByPk(id_mesa);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa de examen no encontrada' });
        }

        // Buscar al alumno por DNI
        let alumno = await Alumno.findOne({ where: { dni } });

        // Crear el alumno si no existe
        if (!alumno) {
            alumno = await Alumno.create({ dni, lu, nombre, apellido, carrera });
            await mesa.addAlumno(alumno, { through: { presente, inscripto } }); // Asignar el alumno a la mesa con los parámetros correspondientes
            return res.status(201).json({ message: 'Alumno creado y asignado a la mesa', alumno });
        }

        // Verificar si ya está asignado a la mesa
        const mesaAlumno = await MesaAlumno.findOne({
            where: { id_mesa, id_estudiante: alumno.id_estudiante }, // Asume que la clave primaria es `id_alumno`
        });

        if (mesaAlumno) {
            return res.status(400).json({ error: 'El alumno ya está asignado a esta mesa' });
        }

        // Asignar el alumno a la mesa
        await mesa.addAlumno(alumno , { through: { presente, inscripto } });
        return res.status(200).json({ message: 'Alumno asignado a la mesa correctamente', alumno });

    } catch (error) {
        // Manejar errores del servidor
        res.status(500).json({
            error: 'Error al asignar el alumno a la mesa',
            details: error.message,
        });
    }
};

const updateAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id);
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        const { dni, lu, nombre, apellido, carrera } = req.body;
        await alumno.update({ dni, lu, nombre, apellido, carrera });
        res.status(200).json(alumno);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el alumno', details: error });
    }
};

const deleteAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id);
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        await alumno.destroy();
        res.status(200).json({ message: 'Alumno eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el alumno', details: error });
    }
};

module.exports = {
    getAllAlumnos,
    getAlumnoById,
    getAlumnosByIdMesaExamen,
    createAlumno,
    assignAlumnoToMesa,
    updateAlumno,
    deleteAlumno,
};

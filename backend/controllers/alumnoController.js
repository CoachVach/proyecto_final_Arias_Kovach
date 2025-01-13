const Alumno = require('../models/alumno'); 
const MesaExamen = require ('../models/mesa_examen');
const Profesor = require('../models/profesor');


// Obtener todos los alumnos
const getAllAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.findAll();
        res.status(200).json(alumnos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los alumnos' });
    }
};

// Obtener un alumno por ID
const getAlumnoById = async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id);
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el alumno' });
    }
};

/* Obtener un alumno por IDMesaExamen
const getAlumnosByIdMesaExamen = async (req, res) => {
    try {
        const alumnos = await Alumno.findAll({ where: { id_mesa: req.params.id } });
        if (!alumnos) {
            return res.status(404).json({ error: 'Alumnos no encontrados' });
        }
        res.status(200).json(alumnos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el conjunto de alumnos' });
    }
};*/

// Obtener un alumno por IDMesaExamen
const getAlumnosByIdMesaExamen = async (req, res) => {
    try {
        //Chequeamos que el token haya sido enviado
        const token = req.headers.authorization?.split(' ')[1]; 
        if (!token) {
          return res.status(403).json({ message: 'No se proporcionó un token de autenticación' });
        }

        //Debemos chequear que la mesa corresponda a al profesor que está inicializado con el token
        const decodedToken = JSON.parse(atob(token.split('.')[1])); 
        const email = decodedToken.email;
        const profesor = await Profesor.findOne({ where: { email } });
        if (!profesor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        const mesa = await MesaExamen.findOne({where: {id_profesor: profesor.id_profesor, id_mesa: req.params.id}});
        
        if(!mesa){
            return res.status(403).json({ message: 'El identificador de la mesa no corresponde con usuario actual' });
        }

        //Encontremos ahora los alumnos que pertenecen a esa mesa
        const alumnos = await Alumno.findAll({ where: { id_mesa: req.params.id } });
        if (!alumnos) {
            return res.status(404).json({ error: 'Alumnos no encontrados' });
        }
        res.status(200).json(alumnos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el conjunto de alumnos' });
    }
};

// Crear un nuevo alumno
const createAlumno = async (req, res) => {
    try {
        const { dni, lu, nombre, apellido, carrera, id_mesa, presente, inscripto } = req.body;
        const newAlumno = await Alumno.create({ dni, lu, nombre, apellido, carrera, id_mesa, presente, inscripto });
        res.status(201).json(newAlumno);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el alumno', details: error });
    }
};


// Actualizar un alumno
const updateAlumno = async (req, res) => {
    try {

        console.log('Este es el id del estudiante a actualizar ',req.params.id_estudiante);
        const alumno = await Alumno.findByPk(req.params.id_estudiante);
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        const { dni, lu, nombre, apellido, carrera, id_mesa, presente, inscripto } = req.body;
        await alumno.update({ dni, lu, nombre, apellido, carrera, id_mesa, presente, inscripto });
        res.status(200).json(alumno);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el alumno', details: error });
    }
};

// Eliminar un alumno
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

// Exportar las funciones del controlador
module.exports = {
    getAllAlumnos,
    getAlumnoById,
    getAlumnosByIdMesaExamen,
    createAlumno,
    updateAlumno,
    deleteAlumno,
};

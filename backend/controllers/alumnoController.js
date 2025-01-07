const Alumno = require('../models/alumno'); 

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

// Crear un nuevo alumno
const createAlumno = async (req, res) => {
    try {
        const { lu, nombre, apellido, carrera } = req.body;
        const newAlumno = await Alumno.create({ lu, nombre, apellido, carrera });
        res.status(201).json(newAlumno);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el alumno', details: error });
    }
};

// Actualizar un alumno
const updateAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findByPk(req.params.id);
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        const { lu, nombre, apellido, carrera } = req.body;
        await alumno.update({ lu, nombre, apellido, carrera });
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
    createAlumno,
    updateAlumno,
    deleteAlumno,
};

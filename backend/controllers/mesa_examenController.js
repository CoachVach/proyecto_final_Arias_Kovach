const MesaExamen = require('../models/mesa_examen');
const Alumno = require('../models/alumno');
const MesaAlumno = require('../models/mesa_alumno');

// Obtener todas las mesas de examen
const getAllMesas = async (req, res) => {
    try {
        const mesas = await MesaExamen.findAll();
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las mesas de examen' });
    }
};

// Obtener una mesa de examen por ID
const getMesaById = async (req, res) => {
    try {
        const mesa = await MesaExamen.findByPk(req.params.id);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa de examen no encontrada' });
        }
        res.status(200).json(mesa);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la mesa de examen' });
    }
};

// Obtener una mesa de examen por ID_PROFESOR
const getMesaByIdProfesor = async (req, res) => {
    try {
        const mesas = await MesaExamen.findAll({ where: { id_profesor: req.params.id_profesor } });
        if (!mesas.length) {
            return res.status(404).json({ error: 'No se encontraron mesas de examen para este profesor' });
        }
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las mesas de examen' });
    }
};

// Crear una nueva mesa de examen
const createMesa = async (req, res) => {
    try {
        const { fecha, materia, id_profesor } = req.body;
        const newMesa = await MesaExamen.create({ fecha, materia, id_profesor });
        res.status(201).json(newMesa);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la mesa de examen', details: error });
    }
};

// Actualizar una mesa de examen
const updateMesa = async (req, res) => {
    try {
        const mesa = await MesaExamen.findByPk(req.params.id);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa de examen no encontrada' });
        }
        const { fecha, materia, id_profesor } = req.body;
        await mesa.update({ fecha, materia, id_profesor });
        res.status(200).json(mesa);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la mesa de examen', details: error });
    }
};

// Eliminar una mesa de examen
const deleteMesa = async (req, res) => {
    try {
        const mesa = await MesaExamen.findByPk(req.params.id);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa de examen no encontrada' });
        }
        await mesa.destroy();
        res.status(200).json({ message: 'Mesa de examen eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la mesa de examen', details: error });
    }
};

// Asignar un alumno a una mesa de examen
const asignarAlumnoAMesa = async (req, res) => {
    try {
        const { id_mesa, id_alumno } = req.body;

        // Verificar que la mesa de examen exista
        const mesa = await MesaExamen.findByPk(id_mesa);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa de examen no encontrada' });
        }

        // Verificar que el alumno exista
        const estudiante = await Alumno.findByPk(id_alumno);
        if (!estudiante) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }

        // Crear la relación en la tabla intermedia
        await MesaAlumno.create({
            id_mesa,
            id_estudiante: id_alumno,
        });

        res.json({ message: 'Alumno asignado a la mesa de examen con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar alumno a la mesa de examen', details: error.message });
    }
};

// Exportar las funciones del controlador
module.exports = {
    getAllMesas,
    getMesaById,
    getMesaByIdProfesor,
    createMesa,
    updateMesa,
    deleteMesa,
    asignarAlumnoAMesa,
};

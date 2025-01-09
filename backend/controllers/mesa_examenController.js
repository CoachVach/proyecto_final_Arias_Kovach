const MesaExamen = require('../models/mesa_examen');


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
const getMesaByProfesor = async (req, res) => {
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

        const mesas = await MesaExamen.findAll({ where: { id_profesor: profesor.id } });
        if (!mesas.length) {
            return res.status(404).json({ error: 'No se encontraron mesas de examen para este profesor' });
        }

        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las mesas de examen' });
    }
};

const createMesa = async (req, res) => {
    try {
        const { fecha, materia, id_profesor } = req.body;
        const newMesa = await MesaExamen.create({ fecha, materia, id_profesor });
        res.status(201).json(newMesa);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la mesa de examen', details: error });
    }
};

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

module.exports = {
    getAllMesas,
    getMesaById,
    getMesaByProfesor,
    createMesa,
    updateMesa,
    deleteMesa
};

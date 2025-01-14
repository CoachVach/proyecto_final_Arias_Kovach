const MesaExamen = require('../models/mesa_examen');
const Alumno = require('../models/alumno');
const MesaAlumno = require('../models/mesa_alumno');
const Profesor = require('../models/profesor');

const getAllMesas = async (req, res) => {
    try {
        const mesas = await MesaExamen.findAll({ include: { model: Alumno, through: MesaAlumno } });
        res.status(200).json(mesas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las mesas de examen' });
    }
};

const getMesaById = async (req, res) => {
    try {
        const mesa = await MesaExamen.findByPk(req.params.id, { include: { model: Alumno, through: MesaAlumno } });
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa de examen no encontrada' });
        }
        res.status(200).json(mesa);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la mesa de examen' });
    }
};

const createMesa = async (req, res) => {
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

        const { fecha, materia } = req.body;
        if (!fecha || !materia) {
            return res.status(400).json({ error: 'Fecha y materia son requeridos' });
        }

        const newMesa = await MesaExamen.create({
            fecha,
            materia,
            id_profesor: profesor.id_profesor
        });

        res.status(201).json(newMesa);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la mesa de examen', details: error.message });
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

const updateAlumnoMesa = async (req, res) =>{
    try {
        const alumno = await Alumno.findByPk(req.params.id_estudiante);
        const mesa = await MesaExamen.findByPk(req.params.id_mesa);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa de examen no encontrada' });
        }
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        const {presente, inscripto} = req.body;
        await MesaAlumno.update({ presente, inscripto }, {
            where: {
                id_estudiante: alumno.id_estudiante,
                id_mesa: mesa.id_mesa
            }
        });
        res.status(200).json(mesa);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la mesa de examen', details: error });
    }
};

const updateDatosAlumnoMesa = async (req, res) =>{
    try {
        const alumno = await Alumno.findByPk(req.params.id_estudiante);
        const mesa = await MesaExamen.findByPk(req.params.id_mesa);
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa de examen no encontrada' });
        }
        if (!alumno) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        const {presente, inscripto, carrera, plan, codigo, calidad} = req.body;
        await MesaAlumno.update({ presente, inscripto, carrera, plan, codigo, calidad }, {
            where: {
                id_estudiante: alumno.id_estudiante,
                id_mesa: mesa.id_mesa,
            }
        });
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

        const mesas = await MesaExamen.findAll({ where: { id_profesor: profesor.id_profesor } });
        if (!mesas.length) {
            return res.status(404).json({ error: 'No se encontraron mesas de examen para este profesor' });
        }
        return res.status(200).json(mesas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las mesas de examen' });
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
    updateDatosAlumnoMesa
};

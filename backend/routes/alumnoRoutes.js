const express = require('express');
const { getAllAlumnos, getAlumnoById, getAlumnosByIdMesaExamen, createAlumno, updateAlumno, deleteAlumno} = require('../controllers/alumnoController');

const router = express.Router();

// Route definitions
router.get('/', getAllAlumnos);
router.get('/:id', getAlumnoById);
router.get('/mesa/:id', getAlumnosByIdMesaExamen);
router.post('/', createAlumno);
router.post('/:id', updateAlumno);
router.delete('/:id', deleteAlumno);

module.exports = router;

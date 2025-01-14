const express = require('express');
const {updateDatosAlumnoMesa, getMesaById, getMesaByProfesor, createMesa, updateMesa, deleteMesa, updateAlumnoMesa } = require('../controllers/mesa_examenController');

const router = express.Router();

// Route definitions
router.get('/profesor', getMesaByProfesor);
router.get('/:id', getMesaById);
router.post('/', createMesa);
router.post('/:id', updateMesa);
router.post('/:id_mesa/:id_estudiante', updateAlumnoMesa);
router.post('/update-alumno//:id_mesa/:id_estudiante', updateDatosAlumnoMesa);
router.delete('/:id', deleteMesa);


module.exports = router;
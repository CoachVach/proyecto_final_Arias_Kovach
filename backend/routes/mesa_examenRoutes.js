const express = require('express');
const {getMesaByColaborador ,updateNotasAlumnos, updateDatosAlumnoMesa, getMesaById, getMesasByProfesor, createMesa, deleteMesa, updateAlumnoMesa, addColaborador } = require('../controllers/mesa_examenController');

const router = express.Router();

// Route definitions
router.get('/profesor', getMesasByProfesor);
router.get('/colaborador', getMesaByColaborador);
router.post('/colaborador/:id_mesa', addColaborador);
router.get('/:id', getMesaById);
router.post('/', createMesa);
router.post('/notas/:id_mesa', updateNotasAlumnos);
router.post('/:id_mesa/:id_estudiante', updateAlumnoMesa);
router.post('/update-alumno//:id_mesa/:id_estudiante', updateDatosAlumnoMesa);
router.delete('/:id', deleteMesa);



module.exports = router;
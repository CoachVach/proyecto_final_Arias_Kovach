const express = require('express');
const { getProfesores, getProfesorById, createProfesor } = require('../controllers/profesorController');

const router = express.Router();

// Route definitions
router.get('/', getProfesores);
router.get('/:id', getProfesorById);
router.post('/', createProfesor);

module.exports = router;

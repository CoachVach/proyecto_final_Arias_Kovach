const express = require('express');
const { getProfesorById, createProfesor, deleteProfesor, updateProfesor } = require('../controllers/profesorController.js');

const router = express.Router();

// Route definitions

router.get('/:id', getProfesorById);
router.post('/', createProfesor);
router.post('/:id', updateProfesor);
router.delete('/:id', deleteProfesor);

module.exports = router;

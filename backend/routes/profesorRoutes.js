const express = require('express');
const { getProfesorById, createProfesor, updateProfesor, deleteProfesor } = require('../controllers/profesorController');

const router = express.Router();

// Route definitions
router.get('/:id', getProfesorById);
router.post('/', createProfesor);
router.post('/:id', updateProfesor);
router.delete('/:id', deleteProfesor);


module.exports = router;

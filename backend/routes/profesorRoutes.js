const express = require('express');
const router = express.Router();
const { 
  getProfesorByToken, 
  updateProfesor, 
  deleteProfesor 
} = require('../controllers/profesorController');

// Rutas para gestión de profesores usando el token JWT para obtener el ID
router.get('/', getProfesorByToken); // Obtener el profesor usando el token
router.put('/', updateProfesor); // Actualizar el profesor usando el token
router.delete('/', deleteProfesor); // Eliminar el profesor usando el token

module.exports = router;

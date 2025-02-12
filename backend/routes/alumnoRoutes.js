const express = require('express');
const { getAlumnosByIdMesaExamen, assignAlumnoToMesa, assignAlumnosToMesa} = require('../controllers/alumnoController');

const router = express.Router();

// Route definitions
router.get('/mesa/:id', getAlumnosByIdMesaExamen);
router.post('/', assignAlumnoToMesa);
router.post('/batch', assignAlumnosToMesa); 

module.exports = router;

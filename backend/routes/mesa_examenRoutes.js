const express = require('express');
const {getMesaById, getMesaByProfesor, createMesa, updateMesa, deleteMesa } = require('../controllers/mesa_examenController');

const router = express.Router();

// Route definitions
router.get('/:id', getMesaById);
router.get('/profesor/:id', getMesaByProfesor);
router.post('/', createMesa);
router.post('/:id', updateMesa);
router.delete('/:id', deleteMesa);


module.exports = router;
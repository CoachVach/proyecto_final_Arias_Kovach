const Profesor = require('../models/profesor');
const bcrypt = require('bcrypt');

// Obtener un profesor por ID
const getProfesorById = async (req, res) => {
  try {
    const profesor = await Profesor.findByPk(req.params.id); // No SQL aquí
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }
    res.status(200).json(profesor);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener profesor', error });
  }
};


const createProfesor = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); // Se crea un "salt" de 10 rondas
    const hashedPassword = await bcrypt.hash(password, salt); // Se encripta la contraseña con el salt

    // Crear el profesor con la contraseña encriptada
    const profesor = await Profesor.create({ nombre, apellido, email, password: hashedPassword });

    res.status(201).json(profesor);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear profesor', error });
  }
};


// Actualizar un profesor
const updateProfesor = async (req, res) => {
  try {
      const profesor = await Profesor.findByPk(req.params.id);
      if (!profesor) {
          return res.status(404).json({ error: 'Profesor no encontrado' });
      }
      const { nombre, apellido, email } = req.body;
      await profesor.update({ nombre, apellido, email });
      res.status(200).json(profesor);
  } catch (error) {
      res.status(400).json({ error: 'Error al actualizar al profesor', details: error });
  }
};

// Eliminar un profesor
const deleteProfesor = async (req, res) => {
  try {
      const profesor = await Profesor.findByPk(req.params.id);
      if (!profesor) {
          return res.status(404).json({ error: 'Profesor no encontrada' });
      }
      await profesor.destroy();
      res.status(200).json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
      res.status(500).json({ error: 'Error al eliminar al profesor', details: error });
  }
};

module.exports = { 
  getProfesorById, 
  createProfesor, 
  deleteProfesor,
  updateProfesor 
};

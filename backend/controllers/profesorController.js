const Profesor = require('../models/profesor');
const bcrypt = require('bcrypt');

const getProfesorByToken = async (req, res) => {
  try {
    res.status(200).json(req.profesor); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener profesor', error });
  }
};

const createProfesor = async ({ nombre, apellido, email, password }) => {
  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); // Se encripta la contraseña con el salt

    // Crear el profesor con la contraseña encriptada
    const profesor = await Profesor.create({ nombre, apellido, email, password: hashedPassword });

    return profesor;
  } catch (error) {
    throw new Error('Error al crear profesor: ' + error.message);
  }
};

const updateProfesor = async (req, res) => {
  try {
    const { nombre, apellido } = req.body;
    await req.profesor.update({ nombre, apellido });
    res.status(200).json(req.profesor); 
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar profesor', error });
  }
};

const deleteProfesor = async (req, res) => {
  try {
    await req.profesor.destroy();
    res.status(200).json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar profesor', error });
  }
};

module.exports = { 
  getProfesorByToken, 
  updateProfesor, 
  deleteProfesor,
  createProfesor 
};

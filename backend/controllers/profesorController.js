const Profesor = require('../models/profesor');
const bcrypt = require('bcrypt');

const getProfesorByToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
      return res.status(403).json({ message: 'No se proporcionó un token de autenticación' });
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const email = decodedToken.email; 

    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    res.status(200).json(profesor); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener profesor', error });
  }
};

const createProfesor = async ({ nombre, apellido, email, password }) => {
  try {
    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); // Se crea un "salt" de 10 rondas
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
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
      return res.status(403).json({ message: 'No se proporcionó un token de autenticación' });
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const email = decodedToken.email;

    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    const { nombre, apellido } = req.body;
    await profesor.update({ nombre, apellido });
    res.status(200).json(profesor); 
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar profesor', error });
  }
};

const deleteProfesor = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
      return res.status(403).json({ message: 'No se proporcionó un token de autenticación' });
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const email = decodedToken.email; 

    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    await profesor.destroy();
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

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

// Actualizar un profesor usando el email del token
const updateProfesor = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token de los headers
    if (!token) {
      return res.status(403).json({ message: 'No se proporcionó un token de autenticación' });
    }

    // Decodificar el token para obtener el email
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica el token JWT
    const email = decodedToken.email; // Usamos el email del token

    // Buscar al profesor por email
    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    // Actualizar los datos del profesor
    const { nombre, apellido } = req.body;
    await profesor.update({ nombre, apellido });
    res.status(200).json(profesor); // Devolver los datos actualizados
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar profesor', error });
  }
};

// Eliminar un profesor usando el email del token
const deleteProfesor = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token de los headers
    if (!token) {
      return res.status(403).json({ message: 'No se proporcionó un token de autenticación' });
    }

    // Decodificar el token para obtener el email
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica el token JWT
    const email = decodedToken.email; // Usamos el email del token

    // Buscar al profesor por email
    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    // Eliminar el profesor
    await profesor.destroy();
    res.status(200).json({ message: 'Profesor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar profesor', error });
  }
};

module.exports = { 
  getProfesorByToken, 
  updateProfesor, 
  deleteProfesor 
};

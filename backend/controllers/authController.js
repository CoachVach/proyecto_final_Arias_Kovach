const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Profesor = require('../models/profesor');
const validator = require('validator'); // Agregar esta línea
const { createProfesor} = require('../controllers/profesorController.js');
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

// Login de profesor
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el profesor existe
    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.log(profesor); // Verifica si devuelve el usuario

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, profesor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: profesor.id, email: profesor.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};


// Register del profesor
const register = async (req, res) => {
  const {email, password, confirmPassword } = req.body;

  try {
    // Validar la contraseña con la confirmContraseña
    if (password !== confirmPassword) {
      return res.status(401).json({ message: 'Las contraseñas ingresadas no son idénticas' });
    }
    // Validar el formato del correo electrónico
    if (!validator.isEmail(email)) { // Cambiar esta línea
      return res.status(401).json({ message: 'El formato del correo electrónico no es válido' });
    }

    // Llamada al método createProfesor
    await createProfesor(req, res);
    
    return res.status(200).json({ message: 'Registro exitoso'});
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};


// Exportar las funciones del controlador
module.exports = {
  login,
  register,
};
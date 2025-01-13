const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Profesor = require('../models/profesor');
const validator = require('validator'); 
const { createProfesor} = require('../controllers/profesorController.js');

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, profesor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: profesor.id_profesor, email: profesor.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

const register = async (req, res) => {
  const { nombre, apellido, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(401).json({ message: 'Las contraseñas ingresadas no son idénticas' });
    }

    if (!validator.isEmail(email)) {
      return res.status(401).json({ message: 'El formato del correo electrónico no es válido' });
    }

    const existingProfesor = await Profesor.findOne({ where: { email } });
    if (existingProfesor) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado' }); // Código 409: Conflicto
    }

    const profesor = await createProfesor({ nombre, apellido, email, password });

    return res.status(200).json({ message: 'Registro exitoso', profesor });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

const validateToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    res.status(200).json({ message: 'Token válido', user: decoded });
  });
};

module.exports = {
  login,
  register,
  validateToken,
};
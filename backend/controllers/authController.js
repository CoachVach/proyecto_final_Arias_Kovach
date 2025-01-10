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

    // Verificar si el correo ya está registrado
    const existingProfesor = await Profesor.findOne({ where: { email } });
    if (existingProfesor) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado' }); // Código 409: Conflicto
    }

    // Crear el profesor
    const profesor = await createProfesor({ nombre, apellido, email, password });

    return res.status(200).json({ message: 'Registro exitoso', profesor });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};




// Exportar las funciones del controlador
module.exports = {
  login,
  register,
};
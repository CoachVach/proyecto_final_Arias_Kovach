const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Profesor = require('../models/profesor')
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

// Login de usuario
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

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


// Exportar las funciones del controlador
module.exports = {
  login,
};



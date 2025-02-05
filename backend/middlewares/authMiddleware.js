const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';
const Profesor = require('../models/profesor');

// Middleware para validar el token
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  // Remove "Bearer" prefix from the token
  const tokenWithoutBearer = token.split(' ')[1];

  // Verify the token
  jwt.verify(tokenWithoutBearer, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const profesor = await Profesor.findOne({ where: { email: decoded.email } });
    if (!profesor) {
        return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    
    req.profesor = profesor;
    next();
  });
};

module.exports = {
  verifyToken
};

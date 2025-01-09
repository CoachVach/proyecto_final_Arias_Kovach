const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

// Middleware para validar el token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  // Remove "Bearer" prefix from the token
  const tokenWithoutBearer = token.split(' ')[1];

  // Verify the token
  jwt.verify(tokenWithoutBearer, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Attach decoded information to the request (you can also add email or id)
    req.profesorEmail = decoded.email;
    next();
  });
};

module.exports = {
  verifyToken
};

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta';

// Middleware para validar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ message: 'Token no proporcionado' });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("ANASHE");
        return res.status(401).json({ message: 'Token inválido' });
      }
  
      req.profesorId = decoded.id;
      next();
    });
  };


module.exports = {
  verifyToken
};
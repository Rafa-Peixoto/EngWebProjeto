const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'EngWeb2024';

module.exports.verificaAcesso = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ error: 'Token inexistente!' });
  }
};

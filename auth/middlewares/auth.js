const jwt = require('jsonwebtoken');

const SECRET_KEY = 'EngWeb2024';

module.exports.verificaAcesso = (req, res, next) => {
  const token = req.cookies.token; // Pegar o token dos cookies
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
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

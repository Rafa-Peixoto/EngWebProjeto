const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'EngWeb2024';

module.exports.verificaAcesso = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/welcome/login');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.redirect('/welcome/login');
    }

    req.user = decoded; // Armazene o usuário decodificado na requisição
    next();
  });
};

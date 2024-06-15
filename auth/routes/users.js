var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require('../models/user');
var jwt = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');

const SECRET_KEY = process.env.SECRET_KEY || 'EngWeb2024';

// Rota de registro de usuário
router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username, email: req.body.email, name: req.body.name }), req.body.password, (err, user) => {
    if (err) {
      console.error('Erro ao registrar usuário:', err);
      return res.status(500).json({ error: err.message });
    }
    passport.authenticate('local', { session: false })(req, res, () => {
      const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.status(201).json({ token: token });
    });
  });
});

// Rota de login de usuário
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign({ username: req.user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ token: token });
});

// Listar todos os usuários (protegida)
router.get('/', (req, res) => {
  User.find().exec()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: err }));
});

// Obter usuário por ID (protegida)
router.get('/:id', (req, res) => {
  User.findById(req.params.id).exec()
    .then(user => {
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: err }));
});

// Deletar usuário por ID (protegida)
router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id).exec()
    .then(result => {
      if (!result) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.status(204).send();
    })
    .catch(err => res.status(500).json({ error: err }));
});

// Atualizar usuário por ID (protegida)
router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec()
    .then(user => {
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;

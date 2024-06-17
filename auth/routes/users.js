var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require('../models/user');
var jwt = require('jsonwebtoken');
const axios = require('axios');

const SECRET_KEY = process.env.SECRET_KEY || 'EngWeb2024';

router.get('/user-ucs/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ ucs: user.ucs });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/add-uc/:username', async (req, res) => {
  const siglaUC = req.body.siglaUC;
  const token = req.cookies.token;
  try {
    const response = await axios.get(`http://localhost:4200/ucs/sigla/${siglaUC}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.data) {
      return res.status(404).json({ error: 'UC não encontrada' });
    }
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $addToSet: { ucs: siglaUC } }, 
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: "UC adicionada com sucesso"});
  } catch (err) {
    console.error('Erro ao adicionar UC:', err.message); 
    if (err.response && err.response.status === 404) {
      return res.redirect('/');
    }
    res.status(500).json({ error: err.message });
  }
});

router.post('/remove-uc/:username', (req, res) => {
  const siglaUC = req.body.siglaUC;
  User.findOneAndUpdate(
    { username: req.params.username },
    { $pull: { ucs: siglaUC } },
    { new: true }
  )
  .then(user => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: "UC removed successfully", ucs: user.ucs });
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
});


router.put('/:id/update-photo', (req, res) => {
  const { profilefoto } = req.body;
  User.findByIdAndUpdate(req.params.id, { profilefoto }, { new: true })
    .then(user => res.status(200).json({ message: "Photo updated successfully", user }))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/user-by-username/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username, email: req.body.email, name: req.body.name }), req.body.password, (err, user) => {
    if (err) {
      console.error('Erro ao registrar usuário:', err);
      return res.status(500).json({ error: err.message });
    }
    passport.authenticate('local', { session: false })(req, res, () => {
      const token = jwt.sign({ username: req.user.username, level: req.user.level }, SECRET_KEY, { expiresIn: '1h' });
      res.status(201).json({ token: token });
    });
  });
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign({ username: req.user.username, level: req.user.level }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ token: token });
});

router.get('/', (req, res) => {
  User.find().exec()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: err }));
});

router.get('/:id', (req, res) => {
  User.findById(req.params.id).exec()
    .then(user => {
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: err }));
});

router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id).exec()
    .then(result => {
      if (!result) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.status(204).send();
    })
    .catch(err => res.status(500).json({ error: err }));
});

router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec()
    .then(user => {
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;

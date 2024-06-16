var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require('../models/user');
var jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'EngWeb2024';

router.get('/user-ucs/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Retorna apenas as UCs do usuário
      res.json({ ucs: user.ucs });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/add-uc/:username', (req, res) => {
  const siglaUC = req.body.siglaUC; // Certifique-se de que 'siglaUC' é enviado no corpo da requisição

  console.log(`Adicionando UC: ${siglaUC} para o usuário: ${req.params.username}`); // Log da tentativa de adição

  User.findOneAndUpdate(
    { username: req.params.username },
    { $addToSet: { ucs: siglaUC } }, // Usando $addToSet para evitar duplicatas
    { new: true }
  )
  .then(user => {
    if (!user) {
      console.log('Usuário não encontrado: ', req.params.username); // Log se o usuário não foi encontrado
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`UC adicionada com sucesso. UCs atualizadas: ${user.ucs}`); // Log do sucesso na operação
    res.json({ message: "UC added successfully", ucs: user.ucs });
  })
  .catch(err => {
    console.log('Erro ao adicionar UC:', err); // Log se ocorrer algum erro na atualização
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

// Rota de registro de usuário
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

// Rota de login de usuário
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign({ username: req.user.username, level: req.user.level }, SECRET_KEY, { expiresIn: '1h' });
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

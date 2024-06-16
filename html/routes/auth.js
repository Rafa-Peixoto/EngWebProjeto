var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/', (req, res) => {
  res.render('welcomepage', { title: 'Welcome' });
});

// Rota para a página de login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Rota para a página de registro
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Rota para o registro de usuários
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:4203/register`, req.body);
    res.cookie('token', response.data.token, { httpOnly: true });
    res.redirect('/welcome/login'); 
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.render('register', { error: error.response.data.error, title: 'Register' });
  }
});

// Rota para o login de usuários
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:4203/login`, req.body);
    res.cookie('token', response.data.token, { httpOnly: true });
    res.redirect('/');  
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.render('login', { error: error.response.data.error, title: 'Login' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/welcome');
});

module.exports = router;

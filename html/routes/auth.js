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

const AUTH_SERVER = "http://localhost:4203";  // Substitua pela URL/porta real

// Rota para o registro de usuários
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVER}/register`, req.body);
    // Definir cookie com o token JWT recebido, se necessário
    res.cookie('token', response.data.token, { httpOnly: true });
    res.redirect('/welcome');  // Ou qualquer outra rota que você deseje redirecionar após o registro
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.render('register', { error: error.response.data.error, title: 'Register' });
  }
});

// Rota para o login de usuários
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVER}/login`, req.body);
    // Definir cookie com o token JWT
    res.cookie('token', response.data.token, { httpAndSecure: true, httpOnly: true });
    res.redirect('/');  // Direcionar para a página principal após login
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.render('login', { error: error.response.data.error, title: 'Login' });
  }
});

// Rota para o logout de usuários
router.get('/logout', (req, res) => {
  // Simplesmente limpar o cookie do token
  res.clearCookie('token');
  res.redirect('/login');  // Redirecionar para a página de login
});

module.exports = router;

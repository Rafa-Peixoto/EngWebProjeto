var express = require('express');
var router = express.Router();
var axios = require('axios');
var authMiddleware = require('../../auth/middlewares/auth');

// Rota principal para listar todas as UCs
router.get('/', authMiddleware.verificaAcesso, (req, res) => {
  axios.get('http://localhost:4200/ucs', { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(dados => res.render('indexUC', { ucs: dados.data, title: 'Lista de UCs' }))
    .catch(erro => {
      console.log('Erro ao carregar UCs: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para uma UC específica
router.get('/ucs/:id', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.id}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(dados => res.render('paginaUC', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => {
      console.log('Erro ao carregar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para a página de criação de UC
router.get('/criar', authMiddleware.verificaAcesso, (req, res) => {
  res.render('criarUC', { title: 'Criar Nova UC' });
});

// Rota para criar uma nova UC
router.post('/ucs', authMiddleware.verificaAcesso, (req, res) => {
  axios.post('http://localhost:4200/ucs', req.body, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(() => res.redirect('/'))
    .catch(erro => {
      console.log('Erro ao criar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para editar uma UC específica
router.put('/ucs/:id', authMiddleware.verificaAcesso, (req, res) => {
  axios.put(`http://localhost:4200/ucs/${req.params.id}`, req.body, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(() => res.redirect(`/ucs/${req.params.id}`))
    .catch(erro => {
      console.log('Erro ao editar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para deletar uma UC específica
router.delete('/ucs/:id', authMiddleware.verificaAcesso, (req, res) => {
  axios.delete(`http://localhost:4200/ucs/${req.params.id}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(() => res.redirect('/'))
    .catch(erro => {
      console.log('Erro ao deletar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

module.exports = router;

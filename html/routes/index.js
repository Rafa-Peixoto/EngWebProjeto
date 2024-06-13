var express = require('express');
var router = express.Router();
var axios = require('axios');

// Rota principal para listar todas as UCs
router.get('/', (req, res) => {
  axios.get('http://localhost:4200/ucs')
      .then(dados => res.render('indexUC', { ucs: dados.data, title: 'Lista de UCs' }))
      .catch(erro => {
          console.log('Erro ao carregar UCs: ' + erro);
          res.render('error', { error: erro });
      });
});

// Rota para uma UC específica
router.get('/ucs/:id', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.id}`)
      .then(dados => res.render('paginaUC', { uc: dados.data, title: dados.data.titulo }))
      .catch(erro => {
          console.log('Erro ao carregar a UC: ' + erro);
          res.render('error', { error: erro });
      });
});

// Rota para a página de criação de UC
router.get('/criar', (req, res) => {
  res.render('criarUC', { title: 'Criar Nova UC' });
});

// Rota para criar uma nova UC
router.post('/ucs', (req, res) => {
  axios.post('http://localhost:4200/ucs', req.body)
      .then(() => res.redirect('/'))
      .catch(erro => {
          console.log('Erro ao criar a UC: ' + erro);
          res.render('error', { error: erro });
      });
});

// Rota para editar uma UC específica
router.put('/ucs/:id', (req, res) => {
  axios.put(`http://localhost:4200/ucs/${req.params.id}`, req.body)
      .then(() => res.redirect(`/ucs/${req.params.id}`))
      .catch(erro => {
          console.log('Erro ao editar a UC: ' + erro);
          res.render('error', { error: erro });
      });
});

// Rota para deletar uma UC específica
router.delete('/ucs/:id', (req, res) => {
  axios.delete(`http://localhost:4200/ucs/${req.params.id}`)
      .then(() => res.redirect('/'))
      .catch(erro => {
          console.log('Erro ao deletar a UC: ' + erro);
          res.render('error', { error: erro });
      });
});

module.exports = router;

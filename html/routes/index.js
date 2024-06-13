var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/', (req, res) => {
  axios.get('http://localhost:4200/ucs')
    .then(dados => res.render('indexUC', { ucs: dados.data, title: 'Lista de UCs' }))
    .catch(erro => {
      console.log('Erro ao carregar UCs: ' + erro);
      res.render('error', { error: erro });
    });
});

router.get('/ucs/:id', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.id}`)
    .then(dados => res.render('paginaUC', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => {
      console.log('Erro ao carregar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/', (req, res) => {
  axios.get('http://localhost:4200/')
      .then(dados => res.render('indexUC', { ucs: dados.data, title: 'Lista de UCs' }))
      .catch(erro => {
          console.log('Erro ao carregar UCs: ' + erro);
          res.render('error', { error: erro });
      });
});

module.exports = router;
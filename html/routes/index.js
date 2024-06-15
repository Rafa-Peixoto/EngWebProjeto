var express = require('express');
var router = express.Router();
var axios = require('axios');
var path = require('path');

// Ajuste o caminho para o users.json
var users = require(path.join(__dirname, '../../users.json'));

// Rota principal para listar todas as UCs
router.get('/', (req, res) => {
  axios.get('http://localhost:4200/ucs')
    .then(dados => {
      const uniqueUcs = Array.from(new Map(dados.data.map(uc => [uc.sigla, uc])).values());
      res.render('indexUC', { uniqueUcs: uniqueUcs, title: 'Lista de UCs' });
    })
    .catch(erro => {
      console.log('Erro ao carregar UCs: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para a página geral de uma UC específica
router.get('/ucs/:sigla', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`)
    .then(dados => {
      res.render('geral', { uc: dados.data, title: dados.data.titulo });
    })
    .catch(erro => {
      console.log('Erro ao carregar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para a página de criação de UC
router.get('/criar', (req, res) => {
  res.render('criarUC', { title: 'Criar Nova UC' });
});


// Rota POST para criar uma nova UC
router.post('/ucs', (req, res) => {
  const newUC = {
    sigla: req.body.sigla,
    titulo: req.body.titulo,
    docentes: req.body.docentes.split(',').map(docente => docente.trim()),
    horario: {
      teoricas: req.body.teoricas.split(',').map(teorica => teorica.trim()),
      praticas: req.body.praticas.split(',').map(pratica => pratica.trim())
    },
    avaliacao: req.body.avaliacao.split(',').map(avaliacao => avaliacao.trim()),
    datas: {
      teste: req.body.dataTeste,
      exame: req.body.dataExame,
      projeto: req.body.dataProjeto
    }
  };

  console.log('Tentando criar nova UC:', newUC);

  axios.post('http://localhost:4200/ucs', newUC)
    .then(() => {
      console.log('UC criada com sucesso');
      res.redirect('/');
    })
    .catch(erro => {
      console.error('Erro ao criar a UC:', erro.response ? erro.response.data : erro.message);
      res.render('error', { error: erro.response ? erro.response.data : erro.message });
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

// Rota para visualizar a seção 'Geral' de uma UC
router.get('/ucs/:sigla/geral', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`)
    .then(dados => res.render('geral', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => res.render('error', { error: erro }));
});

// Rota para visualizar as 'Aulas' de uma UC
router.get('/ucs/:sigla/aulas', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`)
    .then(dados => res.render('aulas', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => res.render('error', { error: erro }));
});

// Rota para visualizar o 'Conteúdo' de uma UC
router.get('/ucs/:sigla/conteudo', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`)
    .then(dados => res.render('conteudo', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => res.render('error', { error: erro }));
});

// Rota para visualizar o perfil
router.get('/perfil', (req, res) => {
  const user = users[0]; // Ajuste conforme necessário para selecionar o usuário
  res.render('perfil', { title: 'Perfil', docente: user });
});

// Rota para criar aula
router.get('/ucs/:sigla/criar-aula', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`)
    .then(response => {
      const uc = response.data;
      res.render('criarAula', { title: 'Criar Aula', uc: uc });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da UC: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para editar aula
router.get('/ucs/:sigla/editar-aula/:aulaId', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}/aulas/${req.params.aulaId}`)
    .then(response => {
      const aula = response.data;
      res.render('editarAula', { title: 'Editar Aula', aula: aula });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da aula: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para eliminar aula
router.get('/ucs/:sigla/eliminar-aula/:aulaId', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}/aulas/${req.params.aulaId}`)
    .then(response => {
      const aula = response.data;
      res.render('eliminarAula', { title: 'Eliminar Aula', aula: aula });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da aula: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para editar UC
router.get('/ucs/:sigla/editar-uc', (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`)
    .then(response => {
      const uc = response.data;
      res.render('editarUC', { title: 'Editar UC', uc: uc });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da UC: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para apagar UC
router.get('/ucs/:sigla/apagar-uc', (req, res) => {
  res.render('apagarUC', { title: 'Apagar UC' });
});

module.exports = router;

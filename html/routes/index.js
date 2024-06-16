var express = require('express');
var router = express.Router();
var axios = require('axios');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
var authMiddleware = require('../../auth/middlewares/auth');

const upload = multer({ dest: 'uploads/' });

const baseDir = path.join(__dirname, '../public/filestore');
const photosDir = path.join(__dirname, '../public/filestore/photos');
fs.ensureDir(photosDir);

router.post('/upload-photo', authMiddleware.verificaAcesso, upload.single('photo'), async (req, res) => {
  const username = req.user.username;  
  const token = req.cookies.token;  
  try {
    const userResponse = await axios.get(`http://localhost:4203/user-by-username/${username}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!userResponse.data) {
      return res.status(404).send("User not found");
    }
    const userId = userResponse.data._id;  
    const filename = `${userId}-${Date.now()}-${req.file.originalname}`;
    const targetPath = path.join(photosDir, filename); 
    await fs.move(req.file.path, targetPath);  
    await axios.put(`http://localhost:4203/${userId}/update-photo`, {
      profilefoto: `/filestore/photos/${filename}`
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.redirect('/perfil');
  } catch (error) {
    res.status(500).send("Failed to update user profile.");
  }
});

router.get('/perfil', authMiddleware.verificaAcesso, (req, res) => {
  const username = req.user.username;
  const token = req.cookies.token;

  axios.get(`http://localhost:4203/user-by-username/${username}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => {
    if (!response.data) {
      return res.status(404).render('error', { error: 'Usuário não encontrado' });
    }
    const userProfile = response.data;
    res.render('perfil', { title: 'Perfil', user: userProfile });
  })
  .catch(error => {
    console.error('Erro ao carregar perfil do usuário:', error);
    res.render('error', { error: error.message });
  });
});

router.get('/', authMiddleware.verificaAcesso, (req, res) => {
  const username = req.user.username;
  axios.get(`http://localhost:4203/user-ucs/${username}`, {
    headers: { 'Authorization': `Bearer ${req.cookies.token}` }
  })
  .then(response => {
    const userUcs = response.data.ucs;
    axios.get('http://localhost:4200/ucs', { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
      .then(dados => {
        const uniqueUcs = Array.from(new Map(dados.data.filter(uc => userUcs.includes(uc.sigla)).map(uc => [uc.sigla, uc])).values());
        res.render('indexUC', { uniqueUcs: uniqueUcs, title: 'Lista de UCs', userLevel: req.user.level});
      })
      .catch(erro => {
        res.render('error', { error: erro });
      });
  })
  .catch(erro => {
    res.render('error', { error: erro });
  });
});

router.post('/add-uc', authMiddleware.verificaAcesso, (req, res) => {
  const username = req.user.username; 
  const siglaUC = req.body.siglaUC;
  const authServerUrl = `http://localhost:4203/add-uc/${username}`;
  axios.post(authServerUrl, { siglaUC: siglaUC }, {
    headers: {
      'Authorization': `Bearer ${req.cookies.token}`
    }
  })
  .then(authResponse => {
    res.redirect('/'); 
  })
  .catch(error => {
    console.error('Erro ao adicionar UC:', error);
    if (!res.headersSent) { 
      res.status(500).send('Erro ao adicionar UC.');
    }
  });
});

router.post('/remove-uc', authMiddleware.verificaAcesso, (req, res) => {
  const username = req.user.username;
  const siglaUC = req.body.siglaUC;
  const authServerUrl = `http://localhost:4203/remove-uc/${username}`;
  axios.post(authServerUrl, { siglaUC: siglaUC }, {
    headers: {
      'Authorization': `Bearer ${req.cookies.token}`
    }
  })
  .then(authResponse => {
    res.redirect('/');
  })
  .catch(error => {
    console.error('Erro ao remover UC:', error);
    if (!res.headersSent) {
      res.status(500).send('Erro ao remover UC.');
    }
  });
});

router.get('/ucs/:id', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.id}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(dados => {
      res.render('geral', { uc: dados.data, title: dados.data.titulo });
    })
    .catch(erro => {
      res.render('error', { error: erro });
    });
});

router.get('/criar', authMiddleware.verificaAcesso, (req, res) => {
  if (req.user.level < 2) {
    return res.status(403).send('Acesso Negado');
  }
  res.render('criarUC', { title: 'Criar Nova UC' , userLevel: req.user.level });
});

router.post('/ucs', authMiddleware.verificaAcesso, (req, res) => {
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

  axios.post('http://localhost:4200/ucs', newUC, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(() => res.redirect('/'))
    .catch(erro => {
      console.log('Erro ao criar a UC: ', erro.response ? erro.response.data : erro.message);
      res.render('error', { error: erro.response ? erro.response.data : erro.message });
    });
});

// Rota POST para atualizar uma UC
router.post('/ucs/:id/editar-uc', authMiddleware.verificaAcesso, (req, res) => {
  const ucData = {
    titulo: req.body.titulo,
    docentes: req.body.docentes.split(',').map(docente => docente.trim()),
    teoricas: req.body.teoricas.split(',').map(teorica => teorica.trim()),
    praticas: req.body.praticas.split(',').map(pratica => pratica.trim()),
    avaliacao: req.body.avaliacao.split(',').map(avaliacao => avaliacao.trim()),
    datas: {
      teste: req.body.dataTeste ? new Date(req.body.dataTeste) : null,
      exame: req.body.dataExame ? new Date(req.body.dataExame) : null,
      projeto: req.body.dataProjeto ? new Date(req.body.dataProjeto) : null,
    }
  };

  axios.put(`http://localhost:4200/ucs/${req.params.id}`, ucData, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(() => {
      console.log('UC atualizada com sucesso');
      res.redirect('/');
    })
    .catch(erro => {
      res.render('error', { error: erro });
    });
});

// Rota para deletar uma UC específica (confirmação)
router.get('/ucs/:id/apagar-uc', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.id}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(response => {
      const uc = response.data;
      res.render('apagarUC', { title: 'Apagar UC', uc: uc });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da UC: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para deletar uma UC específica (confirmação)
router.get('/ucs/:id/apagar-uc', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.id}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(response => {
      const uc = response.data;
      res.render('apagarUC', { title: 'Apagar UC', uc: uc });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da UC: ' + erro);
      res.render('error', { error: erro });
    });
});

router.delete('/ucs/:id', authMiddleware.verificaAcesso, (req, res) => {
  axios.delete(`http://localhost:4200/ucs/${req.params.id}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(() => {
      console.log('UC apagada com sucesso');
      res.redirect('/');
    })
    .catch(erro => {
      console.log('Erro ao apagar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

router.get('/ucs/:sigla/geral', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(dados => res.render('geral', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => res.render('error', { error: erro }));
});

router.get('/ucs/:sigla/aulas', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(dados => res.render('aulas', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => res.render('error', { error: erro }));
});

router.get('/ucs/:sigla/conteudo', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(dados => res.render('conteudo', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => res.render('error', { error: erro }));
});

router.get('/ucs/:sigla/criar-aula', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(response => {
      const uc = response.data;
      res.render('criarAula', { title: 'Criar Aula', uc: uc });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da UC: ' + erro);
      res.render('error', { error: erro });
    });
});

router.get('/ucs/:sigla/editar-aula/:aulaId', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}/aulas/${req.params.aulaId}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(response => {
      const aula = response.data;
      res.render('editarAula', { title: 'Editar Aula', aula: aula });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da aula: ' + erro);
      res.render('error', { error: erro });
    });
});

router.get('/ucs/:sigla/eliminar-aula/:aulaId', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}/aulas/${req.params.aulaId}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(response => {
      const aula = response.data;
      res.render('eliminarAula', { title: 'Eliminar Aula', aula: aula });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da aula: ' + erro);
      res.render('error', { error: erro });
    });
});

router.get('/ucs/:sigla/editar-uc', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(response => {
      const uc = response.data;
      res.render('editarUC', { title: 'Editar UC', uc: uc });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da UC: ' + erro);
      res.render('error', { error: erro });
    });
});

router.get('/ucs/:sigla/apagar-uc', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(response => {
      const uc = response.data;
      res.render('apagarUC', { title: 'Apagar UC', uc: uc });
    })
    .catch(erro => {
      console.log('Erro ao recuperar dados da UC: ' + erro);
      res.render('error', { error: erro });
    });
});

// Rota para confirmar apagar UC
router.delete('/ucs/:id', authMiddleware.verificaAcesso, (req, res) => {
  axios.delete(`http://localhost:4200/ucs/${req.params.id}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(() => {
      console.log('UC apagada com sucesso');
      res.redirect('/');
    })
    .catch(erro => {
      console.log('Erro ao apagar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

module.exports = router;
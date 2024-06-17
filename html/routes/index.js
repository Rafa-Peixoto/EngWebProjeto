var express = require('express');
var router = express.Router();
var axios = require('axios');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
var authMiddleware = require('../../auth/middlewares/auth');

const upload = multer({ dest: 'uploads/' });

const baseDir = path.join(__dirname, '../public/filestore');
const photosDir = path.join(baseDir, 'photos');
const ucsDir = path.join(baseDir, 'ucs');
fs.ensureDir(photosDir);
fs.ensureDir(ucsDir);

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

router.get('/download/:ucSigla/:filename', authMiddleware.verificaAcesso, async (req, res) => {
  const { ucSigla, filename } = req.params; // Usando ucSigla
  const filePath = path.join(__dirname, '../public/filestore/ucs', ucSigla, filename);
  
  res.download(filePath, err => {
    if (err) {
      console.error('Erro ao fazer download do arquivo:', err);
      res.status(500).send('Erro ao fazer download do arquivo.');
    }
  });
});

router.post('/upload-content/:ucSigla', authMiddleware.verificaAcesso, upload.single('contentFile'), async (req, res) => {
  const { ucSigla } = req.params;
  const { ucId } = req.body; 
  const token = req.cookies.token;
  try {
    const response = await axios.get(`http://localhost:4200/ucs/${ucSigla}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.data) {
      return res.status(404).send('UC não encontrada');
    }

    const ucFolder = path.join(ucsDir, ucSigla);
    await fs.ensureDir(ucFolder);

    const filename = req.file.originalname;
    const targetPath = path.join(ucFolder, filename);
    await fs.move(req.file.path, targetPath);

    await axios.post(`http://localhost:4200/ucs/${ucId}/add-file`, { filename }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    res.redirect(`/ucs/${ucSigla}/conteudo`);
  } catch (error) {
    console.error('Erro ao fazer upload de conteúdo:', error.message);
    res.status(500).send('Erro ao fazer upload de conteúdo.');
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
        //console.log('Lista de UCs:', dados.data);
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
  const username = req.user.username;

  axios.get(`http://localhost:4200/ucs/${req.params.id}`, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(dados => {
      isOwner = (dados.data.owner === username);  
      res.render('geral', { uc: dados.data, title: dados.data.titulo, isOwner});
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
router.post('/ucs', authMiddleware.verificaAcesso, async (req, res) => {
  const username = req.user.username;
  const newUC = {
    sigla: req.body.sigla,
    titulo: req.body.titulo,
    owner: username,
    docentes: req.body.docentes.split(',').map(docente => docente.trim()),
    horario: {
      teoricas: req.body.teoricas.split(',').map(teorica => teorica.trim()),
      praticas: req.body.praticas.split(',').map(pratica => pratica.trim())
    },
    avaliacao: req.body.avaliacao.split(',').map(avaliacao => avaliacao.trim()),
    datas: {
      teste: req.body.dataTeste ? new Date(req.body.dataTeste) : null,
      exame: req.body.dataExame ? new Date(req.body.dataExame) : null,
      projeto: req.body.dataProjeto ? new Date(req.body.dataProjeto) : null,
    }
  };
  try {
    const response = await axios.post('http://localhost:4200/ucs', newUC, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } });
    const createdUC = response.data;
    console.log('Resposta da API ao criar UC:', createdUC);

    if (!createdUC.sigla) {
      throw new Error('Sigla da UC não encontrada na resposta');
    }

    await axios.post(`http://localhost:4203/add-uc/${username}`, { siglaUC: createdUC.sigla }, {
      headers: { 'Authorization': `Bearer ${req.cookies.token}` }
    });

    res.redirect('/');
  } catch (erro) {
    console.error('Erro ao criar a UC na API:', erro.response ? erro.response.data : erro.message);
    res.render('error', { error: erro.response ? erro.response.data : erro.message });
  }
});

// Rota POST para atualizar uma UC
router.post('/ucs/:id/editar-uc', authMiddleware.verificaAcesso, (req, res) => {
  console.log('Iniciando atualização da UC:', req.params.id, 'com dados:', req.body);

  const ucData = {
    titulo: req.body.titulo,
    docentes: req.body.docentes.split(',').map(docente => docente.trim()),
    horario: {
      teoricas: req.body.teoricas.split(',').map(teorica => teorica.trim()),
      praticas: req.body.praticas.split(',').map(pratica => pratica.trim())
    },
    avaliacao: req.body.avaliacao.split(',').map(avaliacao => avaliacao.trim()),
    datas: {
      teste: req.body.dataTeste ? new Date(req.body.dataTeste) : null,
      exame: req.body.dataExame ? new Date(req.body.dataExame) : null,
      projeto: req.body.dataProjeto ? new Date(req.body.dataProjeto) : null,
    }
  };

  console.log('Enviando dados para API via PUT:', ucData);

  axios.put(`http://localhost:4200/ucs/${req.params.id}`, ucData, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } })
    .then(() => {
      console.log('Redirecionando após atualização bem-sucedida.');
      res.redirect('/');
    })
    .catch(erro => {
      console.error('Falha na atualização da UC via Axios:', erro.message);
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
      res.redirect('/');
    })
    .catch(erro => {
      res.render('error', { error: erro });
    });
});

router.get('/ucs/:sigla/geral', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`)
    .then(dados => res.render('geral', { uc: dados.data, title: dados.data.titulo }))
    .catch(erro => res.render('error', { error: erro }));
});

router.get('/ucs/:sigla/aulas', authMiddleware.verificaAcesso, async (req, res) => {
  const token = req.cookies.token;
  const username = req.user.username;

  try {
    const response = await axios.get(`http://localhost:4200/ucs/${req.params.sigla}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const uc = response.data;
    const isOwner = (uc.owner === username);

    res.render('aulas', { uc: uc, title: uc.titulo, isOwner: isOwner });
  } catch (erro) {
    console.error('Erro ao recuperar dados da UC:', erro);
    res.render('error', { error: erro });
  }
});


router.get('/ucs/:ucSigla/conteudo', authMiddleware.verificaAcesso, async (req, res) => {
  const { ucSigla } = req.params;
  const username = req.user.username; // Usuário logado
  const token = req.cookies.token;

  try {
    const response = await axios.get(`http://localhost:4200/ucs/sigla/${ucSigla}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.data) {
      return res.status(404).send('UC não encontrada');
    }

    const uc = response.data;
    const isOwner = (uc.owner === username); // Verifica se o usuário é o owner

    res.render('conteudo', { uc, isOwner });
  } catch (error) {
    console.error('Erro ao obter UC:', error.message);
    res.status(500).send('Erro ao obter UC.');
  }
});

router.get('/ucs/:sigla/criar-aula', authMiddleware.verificaAcesso, (req, res) => {
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

router.post('/ucs/:sigla/criar-aula', authMiddleware.verificaAcesso, async (req, res) => {
  const { sigla } = req.params;
  const novaAula = {
    tipo: req.body.tipo,
    data: req.body.data,
    sumario: req.body.sumario.split('\n').map(item => item.trim())
  };

  try {
    const response = await axios.post(`http://localhost:4200/ucs/${sigla}/aulas`, novaAula, { headers: { 'Authorization': `Bearer ${req.cookies.token}` } });
    res.redirect(`/ucs/${sigla}/aulas`);
  } catch (erro) {
    console.error('Erro ao criar a aula:', erro);
    res.render('error', { error: erro.response ? erro.response.data : erro.message });
  }
});

router.post('/ucs/:sigla/aulas/:aulaId/delete', authMiddleware.verificaAcesso, async (req, res) => {
  const { sigla, aulaId } = req.params;
  const token = req.cookies.token;

  try {
    await axios.delete(`http://localhost:4200/ucs/${sigla}/aulas/${aulaId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.redirect(`/ucs/${sigla}/aulas`);
  } catch (erro) {
    console.error('Erro ao excluir a aula:', erro);
    res.render('error', { error: erro.response ? erro.response.data : erro.message });
  }
});


router.get('/ucs/:sigla/eliminar-aula/:aulaId', authMiddleware.verificaAcesso, (req, res) => {
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

router.get('/ucs/:sigla/editar-uc', authMiddleware.verificaAcesso, (req, res) => {
  axios.get(`http://localhost:4200/ucs/${req.params.sigla}`)
    .then(response => {
      const uc = response.data;
      console.log('UC:', uc); 
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
      res.redirect('/');
    })
    .catch(erro => {
      console.log('Erro ao apagar a UC: ' + erro);
      res.render('error', { error: erro });
    });
});

module.exports = router;

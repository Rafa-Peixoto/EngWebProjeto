const express = require('express');
const router = express.Router();
const ucController = require('../controllers/uc');
const UC = require('../models/uc');
const fs = require('fs-extra');
const path = require('path');
// Listar todas as UCs
router.get('/', (req, res) => {
  ucController.list()
    .then(dados => res.status(200).json(dados))
    .catch(erro => res.status(500).send(erro));
});
// Obter UC por sigla
router.get('/:id', (req, res) => {
  ucController.findById(req.params.id)
    .then(dado => {
      if (dado) {
        res.status(200).json(dado);
      } else {
        res.status(404).send('UC não encontrada');
      }
    })
    .catch(erro => res.status(500).send(erro));
});
// Obter aula por UC ID e Aula ID
router.get('/:id/aulas/:aulaId', (req, res) => {
  ucController.findAulaById(req.params.id, req.params.aulaId)
    .then(dado => {
      if (dado) {
        res.status(200).json(dado.aulas[0]);
      } else {
        res.status(404).send('Aula não encontrada');
      }
    })
    .catch(erro => res.status(500).send(erro));
});

router.post('/:id/add-file', async (req, res) => {
  try {
    const uc = await ucController.addFile(req.params.id, req.body.filename);
    if (!uc) {
      return res.status(404).json({ error: 'UC não encontrada' });
    }
    res.status(200).json(uc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//Criar uc
router.post('/', async (req, res) => {
  // Verificar tipos e valores recebidos
  const newUC = {
    sigla: req.body.sigla,
    titulo: req.body.titulo,
    owner: req.body.owner,
    docentes: Array.isArray(req.body.docentes) ? req.body.docentes : (req.body.docentes || '').split(',').map(docente => docente.trim()),
    horario: {
      teoricas: Array.isArray(req.body.horario.teoricas) ? req.body.horario.teoricas : (req.body.horario.teoricas || '').split(',').map(teorica => teorica.trim()),
      praticas: Array.isArray(req.body.horario.praticas) ? req.body.horario.praticas : (req.body.horario.praticas || '').split(',').map(pratica => pratica.trim())
    },
    avaliacao: Array.isArray(req.body.avaliacao) ? req.body.avaliacao : (req.body.avaliacao || '').split(',').map(avaliacao => avaliacao.trim()),
    datas: {
      teste: req.body.datas.teste ? new Date(req.body.datas.teste) : null,
      exame: req.body.datas.exame ? new Date(req.body.datas.exame) : null,
      projeto: req.body.datas.projeto ? new Date(req.body.datas.projeto) : null,
    }
  };
  try {
    const uc = await ucController.insert(newUC);
    console.log('UC criada no banco de dados:', uc);

    const ucFolder = path.join(__dirname, '../../html/public/filestore/ucs', uc.sigla);
    await fs.ensureDir(ucFolder);
    res.status(201).json(uc);
  } catch (erro) {
    console.error('Erro ao criar a UC no banco de dados:', erro.message);
    res.status(500).send({ error: erro.message });
  }
});
// Rota para obter uma UC por sigla
router.get('/sigla/:siglaUC', async (req, res) => {
  const siglaUC = req.params.siglaUC;
  try {
    const uc = await UC.findOne({ sigla: siglaUC });
    if (!uc) {
      return res.status(404).json({ error: 'UC não encontrada' });
    }
    res.status(200).json(uc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Deletar UC por ID (sigla aqui é o id)
router.delete('/:id', async (req, res) => {
  try {
    const ucId = req.params.id;
    const uc = await ucController.findById(ucId);
    if (!uc) {
      return res.status(404).send('UC não encontrada para deletar');
    }
    const resultado = await ucController.removeById(ucId);
    if (resultado.deletedCount === 0) {
      return res.status(404).send('UC não encontrada para deletar');
    }
    const ucFolder = path.join(__dirname, '../../html/public/filestore/ucs', ucId);
    await fs.remove(ucFolder);
    res.status(204).send();
  } catch (erro) {
    console.error('Erro ao deletar a UC:', erro.message);
    res.status(500).send(erro);
  }
});
// Atualizar UC por ID (sigla aqui é o id)
router.put('/:id', (req, res) => {
  const ucData = {
    titulo: req.body.titulo,
    docentes: Array.isArray(req.body.docentes) ? req.body.docentes : (req.body.docentes || '').split(',').map(docente => docente.trim()),
    horario: {
      teoricas: Array.isArray(req.body.horario.teoricas) ? req.body.horario.teoricas : (req.body.horario.teoricas || '').split(',').map(teorica => teorica.trim()),
      praticas: Array.isArray(req.body.horario.praticas) ? req.body.horario.praticas : (req.body.horario.praticas || '').split(',').map(pratica => pratica.trim())
    },
    avaliacao: Array.isArray(req.body.avaliacao) ? req.body.avaliacao : (req.body.avaliacao || '').split(',').map(avaliacao => avaliacao.trim()),
    datas: {
      teste: req.body.datas.teste ? new Date(req.body.datas.teste) : null,
      exame: req.body.datas.exame ? new Date(req.body.datas.exame) : null,
      projeto: req.body.datas.projeto ? new Date(req.body.datas.projeto) : null,
    }
  };

  ucController.update(req.params.id, ucData)
    .then(() => res.status(200).send('UC atualizada com sucesso'))
    .catch(erro => {
      console.error('Erro ao atualizar a UC:', erro.message);
      res.status(500).send({ error: erro.message });
    });
});

router.post('/:sigla/aulas', async (req, res) => {
  const { sigla } = req.params;
  let sumario = req.body.sumario;
  if (Array.isArray(sumario)) {
    sumario = sumario.map(item => item.trim());
  } else if (typeof sumario === 'string') {
    sumario = sumario.split('\n').map(item => item.trim());
  } else {
    sumario = [];
  }
  const novaAula = {
    tipo: req.body.tipo,
    data: req.body.data,
    sumario: sumario
  };
  try {
    const uc = await UC.findOne({ sigla: sigla });
    if (!uc) {
      return res.status(404).send('UC não encontrada');
    }
    uc.aulas.push(novaAula);
    await uc.save();
    res.status(201).json(uc);
  } catch (erro) {
    console.error('Erro ao adicionar aula à UC:', erro.message);
    res.status(500).send({ error: erro.message });
  }
});

router.delete('/:sigla/aulas/:aulaId', async (req, res) => {
  const { sigla, aulaId } = req.params;
  try {
    const uc = await UC.findOne({ sigla: sigla });
    if (!uc) {
      return res.status(404).send('UC não encontrada');
    }
    // Encontre a aula pelo ID e remova-a
    const aulaIndex = uc.aulas.findIndex(aula => aula._id.toString() === aulaId);
    if (aulaIndex === -1) {
      return res.status(404).send('Aula não encontrada');
    }
    uc.aulas.splice(aulaIndex, 1);
    await uc.save();
    res.status(200).json(uc);
  } catch (erro) {
    console.error('Erro ao excluir a aula da UC:', erro.message);
    res.status(500).send({ error: erro.message });
  }
});

module.exports = router;
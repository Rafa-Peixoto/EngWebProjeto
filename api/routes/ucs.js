const express = require('express');
const router = express.Router();
const ucController = require('../controllers/uc');

// Listar todas as UCs
router.get('/', (req, res) => {
  ucController.list()
    .then(dados => res.status(200).json(dados))
    .catch(erro => res.status(500).send(erro));
});

// Obter UC por ID (sigla aqui é o id)
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

// Criar nova UC
router.post('/', (req, res) => {
  const newUC = {
    sigla: req.body.sigla,
    titulo: req.body.titulo,
    docentes: Array.isArray(req.body.docentes) ? req.body.docentes : (req.body.docentes || '').split(',').map(docente => docente.trim()),
    horario: {
      teoricas: Array.isArray(req.body.teoricas) ? req.body.teoricas : (req.body.teoricas || '').split(',').map(teorica => teorica.trim()),
      praticas: Array.isArray(req.body.praticas) ? req.body.praticas : (req.body.praticas || '').split(',').map(pratica => pratica.trim())
    },
    avaliacao: Array.isArray(req.body.avaliacao) ? req.body.avaliacao : (req.body.avaliacao || '').split(',').map(avaliacao => avaliacao.trim()),
    datas: {
      teste: req.body.dataTeste || '',
      exame: req.body.dataExame || '',
      projeto: req.body.dataProjeto || ''
    }
  };

  console.log('Recebendo solicitação para criar nova UC:', newUC);

  ucController.insert(newUC)
    .then(() => res.status(201).send('UC criada com sucesso'))
    .catch(erro => {
      console.error('Erro ao criar a UC:', erro.message);
      res.status(500).send({ error: erro.message });
    });
});

// Deletar UC por ID (sigla aqui é o id)
router.delete('/:id', (req, res) => {
  ucController.removeById(req.params.id)
    .then(resultado => {
      if (resultado.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).send('UC não encontrada para deletar');
      }
    })
    .catch(erro => res.status(500).send(erro));
});

// Atualizar UC por ID (sigla aqui é o id)
router.put('/:id', (req, res) => {
  const ucData = {
    titulo: req.body.titulo,
    docentes: Array.isArray(req.body.docentes) ? req.body.docentes : (req.body.docentes || '').split(',').map(docente => docente.trim()),
    horario: {
      teoricas: Array.isArray(req.body.teoricas) ? req.body.teoricas : (req.body.teoricas || '').split(',').map(teorica => teorica.trim()),
      praticas: Array.isArray(req.body.praticas) ? req.body.praticas : (req.body.praticas || '').split(',').map(pratica => pratica.trim())
    },
    avaliacao: Array.isArray(req.body.avaliacao) ? req.body.avaliacao : (req.body.avaliacao || '').split(',').map(avaliacao => avaliacao.trim()),
    datas: {
      teste: req.body.dataTeste ? new Date(req.body.dataTeste) : null,
      exame: req.body.dataExame ? new Date(req.body.dataExame) : null,
      projeto: req.body.dataProjeto ? new Date(req.body.dataProjeto) : null
    }
  };

  ucController.update(req.params.id, ucData)
    .then(() => res.status(200).send('UC atualizada com sucesso'))
    .catch(erro => {
      console.error('Erro ao atualizar a UC:', erro.message);
      res.status(500).send({ error: erro.message });
    });
});

module.exports = router;

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

  console.log('Recebendo solicitação para criar nova UC:', newUC);

  ucController.insert(newUC)
    .then(() => res.status(201).send('UC criada com sucesso'))
    .catch(erro => {
      console.error('Erro ao criar a UC:', erro.message);
      res.status(500).send('Erro ao criar a UC');
    });
});
// Deletar UC por ID (sigla aqui é o id)
router.delete('/:id', (req, res) => {
  ucController.removeById(req.params.id)
  ucController.removeById(req.params.id)
    .then(resultado => {
      if (resultado.deletedCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).send('UC não encontrada para deletar');
      }
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
  ucController.update(req.params.id, req.body)
  ucController.update(req.params.id, req.body)
    .then(resultado => {
      if (resultado.nModified > 0) {
        res.status(200).json({ message: "UC atualizada com sucesso" });
      } else {
        res.status(404).send('UC não encontrada para atualizar');
      }
    })
    .catch(erro => res.status(500).send(erro));
});

module.exports = router;

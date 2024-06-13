var express = require('express');
var router = express.Router();
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

// Adicionar nova UC
router.post('/', (req, res) => {
    ucController.insert(req.body)
    .then(dado => res.status(201).json(dado))
    .catch(erro => res.status(500).send(erro));
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
    ucController.update(req.params.id, req.body)
    .then(resultado => {
        if (resultado.modifiedCount > 0) {
            res.status(200).json({ message: "UC atualizada com sucesso" });
        } else {
            res.status(404).send('UC não encontrada para atualizar');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

module.exports = router;

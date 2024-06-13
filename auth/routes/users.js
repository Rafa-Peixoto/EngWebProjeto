var express = require('express');
var router = express.Router();

const docenteController = require('../controllers/user');

// Listar todos os docentes
router.get('/', (req, res) => {
    docenteController.list()
    .then(dados => res.status(200).json(dados))
    .catch(erro => res.status(500).send(erro));
});

// Obter docente por ID
router.get('/:id', (req, res) => {
    docenteController.findById(req.params.id)
    .then(dado => {
        if (dado) {
            res.status(200).json(dado);
        } else {
            res.status(404).send('Docente não encontrado');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

// Obter docente por username
router.get('/username/:username', (req, res) => {
    docenteController.findByUsername(req.params.username)
    .then(dado => {
        if (dado) {
            res.status(200).json(dado);
        } else {
            res.status(404).send('Docente não encontrado');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

// Adicionar novo docente
router.post('/', (req, res) => {
    docenteController.insert(req.body)
    .then(dado => res.status(201).json(dado))
    .catch(erro => res.status(500).send(erro));
});

// Deletar docente por ID
router.delete('/:id', (req, res) => {
    docenteController.removeById(req.params.id)
    .then(resultado => {
        if (resultado.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Docente não encontrado para deletar');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

// Atualizar docente por ID
router.put('/:id', (req, res) => {
    docenteController.update(req.params.id, req.body)
    .then(resultado => {
        if (resultado) {
            res.status(200).json({message: "Docente atualizado com sucesso"});
        } else {
            res.status(404).send('Docente não encontrado para atualizar');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

module.exports = router;
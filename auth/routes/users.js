var express = require('express');
var router = express.Router();

const userController = require('../controllers/user');

// Listar todos os usuários
router.get('/', (req, res) => {
    userController.list()
    .then(dados => res.status(200).json(dados))
    .catch(erro => res.status(500).send(erro));
});
  
// Obter usuário por ID
router.get('/:id', (req, res) => {
    userController.findById(req.params.id)
    .then(dado => {
        if (dado) {
            res.status(200).json(dado);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

// Obter usuário por username
router.get('/username/:username', (req, res) => {
    userController.findByUsername(req.params.username)
    .then(dado => {
        if (dado) {
            res.status(200).json(dado);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

// Adicionar novo usuário
router.post('/', (req, res) => {
    userController.insert(req.body)
    .then(dado => res.status(201).json(dado))
    .catch(erro => res.status(500).send(erro));
});

// Deletar usuário por ID
router.delete('/:id', (req, res) => {
    userController.removeById(req.params.id)
    .then(resultado => {
        if (resultado.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Usuário não encontrado para deletar');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

// Atualizar usuário por ID
router.put('/:id', (req, res) => {
    userController.update(req.params.id, req.body)
    .then(resultado => {
        if (resultado) {
            res.status(200).json({ message: "Usuário atualizado com sucesso" });
        } else {
            res.status(404).send('Usuário não encontrado para atualizar');
        }
    })
    .catch(erro => res.status(500).send(erro));
});

module.exports = router;

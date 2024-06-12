var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');

router.get('/', userController.getAllDocentes);
router.post('/', userController.createDocente);
router.get('/:id', userController.getDocenteById);
router.put('/:id', userController.updateDocente);
router.delete('/:id', userController.deleteDocente);

module.exports = router;

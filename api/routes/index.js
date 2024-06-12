var express = require('express');
var router = express.Router();
var ucsController = require('../controllers/ucs');
var usersController = require('../controllers/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: "API funcionando corretamente" });
});

// UC routes
router.get('/ucs', ucsController.getAllUCs);
router.post('/ucs', ucsController.createUC);
router.get('/ucs/:id', ucsController.getUCById);
router.put('/ucs/:id', ucsController.updateUC);
router.delete('/ucs/:id', ucsController.deleteUC);

// User routes
router.get('/users', usersController.getAllDocentes);
router.post('/users', usersController.createDocente);
router.get('/users/:id', usersController.getDocenteById);
router.put('/users/:id', usersController.updateDocente);
router.delete('/users/:id', usersController.deleteDocente);

module.exports = router;

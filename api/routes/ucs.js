var express = require('express');
var router = express.Router();
const ucController = require('../controllers/ucs');

router.get('/', ucController.getAllUCs);
router.post('/', ucController.createUC);
router.get('/:id', ucController.getUCById);
router.put('/:id', ucController.updateUC);
router.delete('/:id', ucController.deleteUC);

module.exports = router;

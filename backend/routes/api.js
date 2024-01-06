const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

router.post('/graphs', graphController.createGraph);
router.get('/graphs/:id', graphController.getGraph);
// Adicione rotas adicionais para update, delete, etc.

module.exports = router;
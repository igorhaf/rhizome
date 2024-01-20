const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

router.post('/graph-data', graphController.createGraph);
router.get('/get-latest-diagram', graphController.getGraph);

module.exports = router;

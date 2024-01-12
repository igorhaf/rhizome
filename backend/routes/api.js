const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');
const {sendCommand} = require("../controllers/components/terminalController");

router.post('/graph-data', graphController.createGraph);
router.get('/get-latest-diagram', graphController.getGraph);
router.get('/execute-command', sendCommand);

module.exports = router;

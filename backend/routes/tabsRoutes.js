const express = require('express');
const router = express.Router();
const tabsController = require('../controllers/tabsController');

router.post('/open', tabsController.openTab);
router.post('/close', tabsController.closeTab);
router.post('/rename', tabsController.renameTab);
router.post('/reposition', tabsController.repositionTab);
router.get('/list', tabsController.listTabs);
router.get('/status', tabsController.getStatus);

module.exports = router;

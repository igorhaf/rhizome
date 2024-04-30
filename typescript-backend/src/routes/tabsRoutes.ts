// src/routes/tabsRoutes.ts
import { Router } from 'express';
import * as tabsController from '../controllers/tabsController';

const router = Router();

router.post('/open', tabsController.openTab);
router.post('/close', tabsController.closeTab);
router.post('/rename', tabsController.renameTab);
router.post('/reposition', tabsController.repositionTab);
router.get('/list', tabsController.listTabs);
router.get('/status', tabsController.getStatus);

export default router;

import { Router } from 'express';
import {
    openTab,
    closeTab,
    renameTab,
    repositionTab,
    listTabs,
    getStatus
} from '../controllers/tabsController';

const router = Router();

router.post('/open', openTab);
router.post('/close', closeTab);
router.post('/rename', renameTab);
router.post('/reposition', repositionTab);
router.get('/list', listTabs);
router.get('/status', getStatus);

export default router;

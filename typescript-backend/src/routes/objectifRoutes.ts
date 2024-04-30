// src/routes/objectifRoutes.ts
import { Router } from 'express';
import * as objectifController from '../controllers/objectifController';

const router = Router();

router.post('/create', objectifController.createObjectif);
router.put('/update/:id', objectifController.updateObjectif);
router.get('/get/:id', objectifController.getObjectif);
router.delete('/delete/:id', objectifController.deleteObjectif);
router.get('/list', objectifController.listObjectifs);

export default router;

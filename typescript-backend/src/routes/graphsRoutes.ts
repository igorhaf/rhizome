// src/routes/graphsRoutes.ts
import { Router } from 'express';
import * as graphController from '../controllers/graphController';

const router = Router();

router.post('/graph-data', graphController.createGraph);
router.get('/get-latest-diagram', graphController.getGraph);

export default router;

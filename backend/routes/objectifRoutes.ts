import { Router } from 'express';
import {
    createObjectif,
    updateObjectif,
    getObjectif,
    deleteObjectif,
    listObjectifs
} from '../controllers/objectifController';

const router = Router();

router.post('/create', createObjectif);
router.put('/update/:id', updateObjectif);
router.get('/get/:id', getObjectif);
router.delete('/delete/:id', deleteObjectif);
router.get('/list', listObjectifs);

export default router;

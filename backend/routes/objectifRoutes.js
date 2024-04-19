const express = require('express');
const router = express.Router();
const {
    createObjectif,
    updateObjectif,
    getObjectif,
    deleteObjectif,
    listObjectifs
} = require('../controllers/objectifController');

router.post('/create', createObjectif);
router.put('/update/:id', updateObjectif);
router.get('/get/:id', getObjectif);
router.delete('/delete/:id', deleteObjectif);
router.get('/list', listObjectifs);

module.exports = router;

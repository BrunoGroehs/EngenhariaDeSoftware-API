const express = require('express');
const router = express.Router();
const { create, get, update, remove } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', create);
router.get('/:id', authenticateToken, get);
router.put('/:id', authenticateToken, update);
router.delete('/:id', authenticateToken, remove);

module.exports = router;

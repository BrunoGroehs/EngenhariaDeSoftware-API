const express = require('express');
const router = express.Router();
const { create, get, listByUser, update, remove } = require('../controllers/taskController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, create);
router.get('/:id', authenticateToken, get);
router.get('/', authenticateToken, listByUser);
router.put('/:id', authenticateToken, update);
router.delete('/:id', authenticateToken, remove);

module.exports = router;

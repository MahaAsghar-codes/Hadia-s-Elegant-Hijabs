const express = require('express');
const { getStats, getUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;

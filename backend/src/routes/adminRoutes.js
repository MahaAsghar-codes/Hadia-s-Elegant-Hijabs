const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { adminLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.get('/stats', adminLimiter, protect, restrictTo('admin'), getDashboardStats);
router.get('/users', adminLimiter, protect, restrictTo('admin'), getUsers);
router.patch('/users/:id/role', adminLimiter, protect, restrictTo('admin'), updateUserRole);
router.delete('/users/:id', adminLimiter, protect, restrictTo('admin'), deleteUser);

module.exports = router;

const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', protect, restrictTo('admin'), getDashboardStats);
router.get('/users', protect, restrictTo('admin'), getUsers);
router.patch('/users/:id/role', protect, restrictTo('admin'), updateUserRole);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);

module.exports = router;

const express = require('express');
const {
  createOrderFromCart,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrderFromCart);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.patch('/:id/status', protect, restrictTo('admin'), updateOrderStatus);

module.exports = router;

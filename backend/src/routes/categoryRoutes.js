const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, restrictTo('admin'), createCategory);

module.exports = router;

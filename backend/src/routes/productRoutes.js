const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

const productValidation = [
  body('name').notEmpty().withMessage('Product name is required.'),
  body('slug').notEmpty().withMessage('Product slug is required.'),
  body('description').notEmpty().withMessage('Description is required.'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer.'),
  body('category').notEmpty().withMessage('Category is required.')
];

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, restrictTo('admin'), productValidation, createProduct);
router.put('/:id', protect, restrictTo('admin'), productValidation, updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

module.exports = router;

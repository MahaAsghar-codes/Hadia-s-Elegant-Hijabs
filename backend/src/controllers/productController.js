const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const validate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(errors.array()[0].msg, 400);
};

exports.getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, featured, sort = '-createdAt' } = req.query;
  const query = {};

  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (featured === 'true') query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(query).populate('category', 'name slug').sort(sort);
  res.json(products);
});

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) throw new ApiError('Product not found.', 404);
  res.json(product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  validate(req);
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  validate(req);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!product) throw new ApiError('Product not found.', 404);
  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError('Product not found.', 404);
  res.json({ message: 'Product deleted successfully.' });
});

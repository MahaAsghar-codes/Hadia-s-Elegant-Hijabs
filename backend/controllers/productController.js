const Product = require('../models/Product');
const { isValidObjectId } = require('../utils/validators');
const { Types } = require('mongoose');

const sanitizeProductPayload = (payload = {}) => {
  const cleaned = {};
  if (typeof payload.name === 'string') cleaned.name = payload.name;
  if (typeof payload.description === 'string') cleaned.description = payload.description;
  if (payload.price !== undefined) cleaned.price = Number(payload.price);
  if (payload.stock !== undefined) cleaned.stock = Number(payload.stock);
  if (typeof payload.image === 'string') cleaned.image = payload.image;
  if (payload.featured !== undefined) cleaned.featured = Boolean(payload.featured);

  if (payload.category && isValidObjectId(payload.category)) {
    cleaned.category = new Types.ObjectId(payload.category);
  }

  return cleaned;
};

const getProducts = async (req, res, next) => {
  try {
    const { q, category, minPrice, maxPrice, featured } = req.query;

    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({ message: 'Invalid category filter' });
      }
      filter.category = new Types.ObjectId(category);
    }
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const safeProductId = new Types.ObjectId(req.params.id);
    const product = await Product.findById(safeProductId).populate('category', 'name description');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const payload = sanitizeProductPayload(req.body);
    if (
      !payload.name ||
      !payload.description ||
      !Number.isFinite(payload.price) ||
      !Number.isFinite(payload.stock) ||
      !payload.category
    ) {
      return res.status(400).json({ message: 'Invalid product payload' });
    }

    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const safeProductId = new Types.ObjectId(req.params.id);
    const payload = sanitizeProductPayload(req.body);
    if (
      (payload.price !== undefined && !Number.isFinite(payload.price)) ||
      (payload.stock !== undefined && !Number.isFinite(payload.stock))
    ) {
      return res.status(400).json({ message: 'Invalid product payload' });
    }
    const product = await Product.findByIdAndUpdate(safeProductId, payload, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const safeProductId = new Types.ObjectId(req.params.id);
    const product = await Product.findById(safeProductId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

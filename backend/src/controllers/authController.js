const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const validate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(errors.array()[0].msg, 400);
  }
};

const authPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken({ id: user._id, role: user.role })
});

exports.signup = asyncHandler(async (req, res) => {
  validate(req);
  const { name, email, password } = req.body;
  const safeEmailFilter = mongoose.sanitizeFilter({ email: String(email).trim().toLowerCase() });
  const exists = await User.findOne(safeEmailFilter);
  if (exists) throw new ApiError('Email is already registered.', 409);

  const user = await User.create({ name, email, password, role: 'user' });
  res.status(201).json(authPayload(user));
});

exports.login = asyncHandler(async (req, res) => {
  validate(req);
  const { email, password } = req.body;
  const safeEmailFilter = mongoose.sanitizeFilter({ email: String(email).trim().toLowerCase() });
  const user = await User.findOne(safeEmailFilter).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError('Invalid email or password.', 401);
  }

  res.json(authPayload(user));
});

exports.adminLogin = asyncHandler(async (req, res) => {
  validate(req);
  const { email, password } = req.body;
  const safeEmailFilter = mongoose.sanitizeFilter({ email: String(email).trim().toLowerCase() });
  const user = await User.findOne(safeEmailFilter).select('+password');
  if (!user || user.role !== 'admin' || !(await user.matchPassword(password))) {
    throw new ApiError('Invalid admin credentials.', 401);
  }

  res.json(authPayload(user));
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist').populate('cart.product');
  res.json(user);
});

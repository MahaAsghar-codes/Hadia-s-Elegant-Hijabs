const mongoose = require('mongoose');

const isValidEmail = (value = '') => /^(?=.{6,254}$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const isValidObjectId = (value = '') => mongoose.Types.ObjectId.isValid(String(value));

module.exports = {
  isValidEmail,
  normalizeEmail,
  isValidObjectId
};

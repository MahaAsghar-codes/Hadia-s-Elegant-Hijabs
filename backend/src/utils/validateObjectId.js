const mongoose = require('mongoose');
const ApiError = require('./apiError');

const ensureObjectId = (value, fieldName = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(`Invalid ${fieldName}.`, 400);
  }
  return value;
};

module.exports = ensureObjectId;

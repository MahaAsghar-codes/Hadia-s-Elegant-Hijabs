const mongoose = require('mongoose');

const isValidEmail = (value = '') => {
  const email = String(value).trim();
  const atIndex = email.indexOf('@');
  const dotIndex = email.lastIndexOf('.');
  return (
    email.length >= 6 &&
    atIndex > 0 &&
    dotIndex > atIndex + 1 &&
    dotIndex < email.length - 1 &&
    !email.includes(' ')
  );
};

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const isValidObjectId = (value = '') => mongoose.Types.ObjectId.isValid(String(value));

const isStrongPassword = (value = '') =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/.test(String(value));

module.exports = {
  isValidEmail,
  normalizeEmail,
  isValidObjectId,
  isStrongPassword
};

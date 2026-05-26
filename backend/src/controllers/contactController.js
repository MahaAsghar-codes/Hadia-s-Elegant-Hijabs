const { validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

exports.submitContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new ApiError(errors.array()[0].msg, 400);

  const message = await ContactMessage.create(req.body);
  res.status(201).json({
    message: 'Message received. Our team will contact you shortly.',
    id: message._id
  });
});

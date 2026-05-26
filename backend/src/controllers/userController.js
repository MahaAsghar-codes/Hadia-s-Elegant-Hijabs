const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const ensureObjectId = require('../utils/validateObjectId');

exports.getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const userId = ensureObjectId(req.params.id, 'user id');
  const user = await User.findById(userId);
  if (!user) throw new ApiError('User not found.', 404);
  if (!['user', 'admin'].includes(req.body.role)) {
    throw new ApiError('Role must be user or admin.', 400);
  }

  user.role = req.body.role;
  await user.save();

  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const userId = ensureObjectId(req.params.id, 'user id');
  const user = await User.findById(userId);
  if (!user) throw new ApiError('User not found.', 404);

  await user.deleteOne();
  res.json({ message: 'User removed successfully.' });
});

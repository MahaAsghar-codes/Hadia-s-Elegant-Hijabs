const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate value exists.' });
  }

  return res.status(statusCode).json({
    message: err.message || 'Internal server error'
  });
};

const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };

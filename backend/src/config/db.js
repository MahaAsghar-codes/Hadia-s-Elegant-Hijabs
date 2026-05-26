const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || 'hadias_elegant_hijabs'
  });

  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
};

module.exports = connectDB;

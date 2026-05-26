require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: "Hadia's Elegant Hijabs" });
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

const allowedPages = new Set([
  'products',
  'product',
  'cart',
  'wishlist',
  'about',
  'contact',
  'login',
  'signup',
  'admin',
  'admin-login'
]);

app.get('/pages/:page', (req, res, next) => {
  if (!allowedPages.has(req.params.page)) {
    res.status(404);
    return next(new Error('Page not found'));
  }
  res.sendFile(path.join(frontendPath, 'pages', `${req.params.page}.html`));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

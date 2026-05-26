require('dotenv').config();
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const { categories, products } = require('../data/sampleData');

const run = async () => {
  await connectDB();

  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), User.deleteMany({})]);

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

  await Product.insertMany(
    products.map((product) => ({
      ...product,
      category: categoryMap[product.categorySlug]
    }))
  );

  await User.create({
    name: 'Hadia Admin',
    email: process.env.ADMIN_EMAIL || 'admin@hadias-elegant-hijabs.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin'
  });

  // eslint-disable-next-line no-console
  console.log('Seeded categories, products, and admin user.');
  process.exit(0);
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});

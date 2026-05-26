require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { isStrongPassword } = require('./validators');

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);

  const categories = await Category.insertMany([
    { name: 'Hijabs', description: 'Elegant daily and formal hijabs' },
    { name: 'Niqabs', description: 'Breathable and lightweight niqabs' },
    { name: 'Hijab Caps', description: 'Comfortable undercaps for secure styling' },
    { name: 'Sleeves', description: 'Modest arm sleeves for layered looks' },
    { name: 'Pins', description: 'Stylish and secure hijab pins' }
  ]);

  const categoryMap = Object.fromEntries(categories.map((category) => [category.name, category._id]));

  await Product.insertMany([
    {
      name: 'Silk Grace Hijab',
      description: 'Premium soft silk blend hijab perfect for work and formal events.',
      price: 24.99,
      stock: 40,
      category: categoryMap.Hijabs,
      featured: true
    },
    {
      name: 'Comfort Fit Niqab',
      description: 'Lightweight niqab with breathable fabric and secure fit.',
      price: 18.5,
      stock: 55,
      category: categoryMap.Niqabs,
      featured: true
    },
    {
      name: 'Everyday Hijab Cap',
      description: 'Stretchable cotton cap designed for all-day comfort.',
      price: 9.99,
      stock: 120,
      category: categoryMap['Hijab Caps']
    },
    {
      name: 'Modesty Sleeves Set',
      description: 'Smooth and cooling sleeves ideal for warm days.',
      price: 11.99,
      stock: 80,
      category: categoryMap.Sleeves
    },
    {
      name: 'Crystal Hijab Pins',
      description: 'Elegant premium pin set for secure and stylish draping.',
      price: 7.49,
      stock: 150,
      category: categoryMap.Pins
    }
  ]);

  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD must be set before running seed script');
  }
  if (!isStrongPassword(process.env.ADMIN_PASSWORD)) {
    throw new Error(
      'ADMIN_PASSWORD must be 8+ characters and include upper, lower, number, and special character'
    );
  }

  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@hadiaeleganthijabs.com',
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    role: 'admin'
  });

  console.log('Seed data created successfully');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Seeding failed:', error.message);
  process.exit(1);
});

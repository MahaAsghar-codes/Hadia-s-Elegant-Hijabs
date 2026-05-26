const categories = [
  { name: 'Hijabs', slug: 'hijabs', description: 'Elegant everyday and occasion hijabs' },
  { name: 'Niqabs', slug: 'niqabs', description: 'Comfortable premium niqabs' },
  { name: 'Hijab Caps', slug: 'hijab-caps', description: 'Soft and breathable undercaps' },
  { name: 'Sleeves', slug: 'sleeves', description: 'Stretchable modesty sleeves' },
  { name: 'Pins', slug: 'pins', description: 'Stylish secure hijab pins' }
];

const products = [
  {
    name: 'Royal Chiffon Hijab - Dusty Rose',
    slug: 'royal-chiffon-hijab-dusty-rose',
    description: 'Lightweight premium chiffon hijab with graceful drape and all-day comfort.',
    price: 22,
    compareAtPrice: 27,
    stock: 80,
    isFeatured: true,
    tags: ['chiffon', 'premium'],
    images: ['https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80'],
    categorySlug: 'hijabs'
  },
  {
    name: 'Breathable Classic Niqab - Jet Black',
    slug: 'breathable-classic-niqab-jet-black',
    description: 'Soft breathable niqab designed for daily wear and comfort.',
    price: 18,
    stock: 120,
    isFeatured: true,
    tags: ['daily wear'],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
    categorySlug: 'niqabs'
  },
  {
    name: 'Cotton Jersey Hijab Cap - Nude',
    slug: 'cotton-jersey-hijab-cap-nude',
    description: 'Slip-resistant cotton jersey cap for secure layering under hijabs.',
    price: 9,
    stock: 200,
    tags: ['cotton'],
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'],
    categorySlug: 'hijab-caps'
  },
  {
    name: 'Essential Modesty Sleeves - Pearl White',
    slug: 'essential-modesty-sleeves-pearl-white',
    description: 'Soft stretch sleeves for layering under short sleeves and blazers.',
    price: 12,
    stock: 150,
    tags: ['stretch'],
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'],
    categorySlug: 'sleeves'
  },
  {
    name: 'Pearl Magnetic Hijab Pins Set',
    slug: 'pearl-magnetic-hijab-pins-set',
    description: 'No-snag magnetic pin set with elegant pearl finish.',
    price: 7,
    stock: 300,
    tags: ['accessories'],
    images: ['https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=900&q=80'],
    categorySlug: 'pins'
  }
];

module.exports = { categories, products };

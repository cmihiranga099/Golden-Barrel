import 'reflect-metadata';
import 'dotenv/config';
import mongoose from 'mongoose';
import { hashPassword } from './common/utils/password';
import { UserSchema } from './users/schemas/user.schema';
import { CategorySchema } from './categories/schemas/category.schema';
import { BrandSchema } from './brands/schemas/brand.schema';
import { ProductSchema } from './products/schemas/product.schema';

const run = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/golden_barrel';
  await mongoose.connect(uri);

  const User = mongoose.model('User', UserSchema);
  const Category = mongoose.model('Category', CategorySchema);
  const Brand = mongoose.model('Brand', BrandSchema);
  const Product = mongoose.model('Product', ProductSchema);

  await User.deleteMany({});
  await Category.deleteMany({});
  await Brand.deleteMany({});
  await Product.deleteMany({});

  const categories = await Category.insertMany([
    { name: 'Whisky', slug: 'whisky' },
    { name: 'Vodka', slug: 'vodka' },
    { name: 'Rum', slug: 'rum' },
    { name: 'Wine', slug: 'wine' },
    { name: 'Beer', slug: 'beer' },
  ]);

  const brands = await Brand.insertMany([
    { name: 'Golden Reserve', slug: 'golden-reserve' },
    { name: 'Midnight Oak', slug: 'midnight-oak' },
    { name: 'Copper Coast', slug: 'copper-coast' },
    { name: 'Silver Crest', slug: 'silver-crest' },
    { name: 'Barrel & Bloom', slug: 'barrel-bloom' },
  ]);

  const categoryBySlug = Object.fromEntries(categories.map((c: any) => [c.slug, c]));
  const brandBySlug = Object.fromEntries(brands.map((b: any) => [b.slug, b]));

  const imageBank = {
    whisky: [
      'https://images.unsplash.com/photo-1608356237786-395cbb86c366?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHw0fHx3aGlza2V5JTIwYm90dGxlfGVufDB8fHx8MTc1MTY2NTY1Nnww&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1716720882232-9fa4912f142d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHw1fHx3aGlza2V5JTIwc2hlbGZ8ZW58MHx8fHwxNzUxNjY1NjU2fDA&ixlib=rb-4.1.0&q=85',
    ],
    vodka: [
      'https://images.unsplash.com/photo-1598509523659-6d5cd643c571?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHwyMnx8dm9ka2ElMjBib3R0bGV8ZW58MHx8fHwxNzUxNjY1NTYwfDA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1598509523659-6d5cd643c571?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHwyMnx8dm9ka2ElMjBib3R0bGV8ZW58MHx8fHwxNzUxNjY1NTYwfDA&ixlib=rb-4.1.0&q=85',
    ],
    rum: [
      'https://images.unsplash.com/photo-1716534436087-214198e3781e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHwyfHxydW0lMjBib3R0bGV8ZW58MHx8fHwxNzUxNjY1NTYxfDA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1716534436087-214198e3781e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHwyfHxydW0lMjBib3R0bGV8ZW58MHx8fHwxNzUxNjY1NTYxfDA&ixlib=rb-4.1.0&q=85',
    ],
    wine: [
      'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHwzfHx3aW5lJTIwYm90dGxlfGVufDB8fHx8MTc1MTY2NTczOXww&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1444723121867-7a241cacace9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHw0fHx3aW5lJTIwYm90dGxlfGVufDB8fHx8MTc1MTY2NTczOXww&ixlib=rb-4.1.0&q=85',
    ],
    beer: [
      'https://images.unsplash.com/photo-1543431786-3e1d4f4a939f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHwyfHxiZWVyJTIwYm90dGxlfGVufDB8fHx8MTc1MTY2NTc1NHww&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1740161115290-d1e9dd7e18d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHwzfHxiZWVyJTIwYm90dGxlfGVufDB8fHx8MTc1MTY2NTc1NHww&ixlib=rb-4.1.0&q=85',
    ],
  };

  const sampleProducts = [
    {
      name: 'Golden Reserve 12 Year',
      slug: 'golden-reserve-12-year',
      category: 'whisky',
      brand: 'golden-reserve',
      price: 68,
      discountPrice: 59,
      stock: 42,
      images: imageBank.whisky,
      abv: 40,
      volume: 750,
      description: 'Balanced single malt with honeyed oak, vanilla, and a soft smoky finish.',
      tags: ['single-malt', 'oak', 'smooth'],
    },
    {
      name: 'Midnight Oak Rye',
      slug: 'midnight-oak-rye',
      category: 'whisky',
      brand: 'midnight-oak',
      price: 54,
      stock: 38,
      images: imageBank.whisky,
      abv: 45,
      volume: 750,
      description: 'Peppery rye spice with cocoa nib and toasted cedar notes.',
      tags: ['rye', 'spice', 'bold'],
    },
    {
      name: 'Copper Coast Bourbon',
      slug: 'copper-coast-bourbon',
      category: 'whisky',
      brand: 'copper-coast',
      price: 49,
      stock: 55,
      images: imageBank.whisky,
      abv: 43,
      volume: 750,
      description: 'Classic bourbon sweetness with caramel, orange peel, and toasted oak.',
      tags: ['bourbon', 'caramel', 'classic'],
    },
    {
      name: 'Silver Crest Highlands',
      slug: 'silver-crest-highlands',
      category: 'whisky',
      brand: 'silver-crest',
      price: 72,
      stock: 24,
      images: imageBank.whisky,
      abv: 46,
      volume: 750,
      description: 'Bright citrus, heather, and malt with a crisp, dry finish.',
      tags: ['highlands', 'citrus', 'elegant'],
    },
    {
      name: 'Barrel & Bloom Sherry Cask',
      slug: 'barrel-bloom-sherry-cask',
      category: 'whisky',
      brand: 'barrel-bloom',
      price: 85,
      stock: 18,
      images: imageBank.whisky,
      abv: 48,
      volume: 750,
      description: 'Rich dried fruit, dark chocolate, and toasted almond from sherry casks.',
      tags: ['sherry', 'rich', 'limited'],
    },
    {
      name: 'Silver Crest Pure Vodka',
      slug: 'silver-crest-pure-vodka',
      category: 'vodka',
      brand: 'silver-crest',
      price: 32,
      stock: 80,
      images: imageBank.vodka,
      abv: 40,
      volume: 750,
      description: 'Triple-filtered vodka with a clean, smooth finish.',
      tags: ['vodka', 'clean', 'smooth'],
    },
    {
      name: 'Golden Reserve Citrus Vodka',
      slug: 'golden-reserve-citrus-vodka',
      category: 'vodka',
      brand: 'golden-reserve',
      price: 34,
      stock: 64,
      images: imageBank.vodka,
      abv: 38,
      volume: 750,
      description: 'Bright lemon peel and subtle botanical lift for cocktails.',
      tags: ['citrus', 'mixing', 'fresh'],
    },
    {
      name: 'Copper Coast Winter Wheat Vodka',
      slug: 'copper-coast-wheat-vodka',
      category: 'vodka',
      brand: 'copper-coast',
      price: 36,
      stock: 47,
      images: imageBank.vodka,
      abv: 40,
      volume: 750,
      description: 'Soft wheat sweetness with a silky mouthfeel.',
      tags: ['wheat', 'silky', 'premium'],
    },
    {
      name: 'Barrel & Bloom Vanilla Vodka',
      slug: 'barrel-bloom-vanilla-vodka',
      category: 'vodka',
      brand: 'barrel-bloom',
      price: 35,
      stock: 52,
      images: imageBank.vodka,
      abv: 35,
      volume: 750,
      description: 'Madagascar vanilla and cream notes for dessert cocktails.',
      tags: ['vanilla', 'sweet', 'cocktails'],
    },
    {
      name: 'Midnight Oak Dark Rum',
      slug: 'midnight-oak-dark-rum',
      category: 'rum',
      brand: 'midnight-oak',
      price: 41,
      stock: 60,
      images: imageBank.rum,
      abv: 40,
      volume: 750,
      description: 'Molasses, toasted sugar, and warm spice with a long finish.',
      tags: ['dark-rum', 'spiced', 'smooth'],
    },
    {
      name: 'Copper Coast Spiced Rum',
      slug: 'copper-coast-spiced-rum',
      category: 'rum',
      brand: 'copper-coast',
      price: 38,
      stock: 70,
      images: imageBank.rum,
      abv: 37.5,
      volume: 750,
      description: 'Cinnamon, clove, and vanilla for classic rum cocktails.',
      tags: ['spiced', 'cocktail', 'warm'],
    },
    {
      name: 'Golden Reserve White Rum',
      slug: 'golden-reserve-white-rum',
      category: 'rum',
      brand: 'golden-reserve',
      price: 29,
      stock: 90,
      images: imageBank.rum,
      abv: 38,
      volume: 750,
      description: 'Clean white rum with bright tropical notes.',
      tags: ['white-rum', 'tropical', 'mixing'],
    },
    {
      name: 'Barrel & Bloom Aged Rum',
      slug: 'barrel-bloom-aged-rum',
      category: 'rum',
      brand: 'barrel-bloom',
      price: 52,
      stock: 34,
      images: imageBank.rum,
      abv: 42,
      volume: 750,
      description: 'Aged rum with toffee, oak, and roasted coconut.',
      tags: ['aged', 'toffee', 'oak'],
    },
    {
      name: 'Silver Crest Cabernet Reserve',
      slug: 'silver-crest-cabernet-reserve',
      category: 'wine',
      brand: 'silver-crest',
      price: 46,
      stock: 48,
      images: imageBank.wine,
      abv: 13.5,
      volume: 750,
      description: 'Blackberry, cedar, and a structured tannin finish.',
      tags: ['cabernet', 'red', 'reserve'],
    },
    {
      name: 'Golden Reserve Pinot Noir',
      slug: 'golden-reserve-pinot-noir',
      category: 'wine',
      brand: 'golden-reserve',
      price: 39,
      stock: 52,
      images: imageBank.wine,
      abv: 13,
      volume: 750,
      description: 'Silky cherry, soft spice, and a velvet finish.',
      tags: ['pinot-noir', 'red', 'silky'],
    },
    {
      name: 'Barrel & Bloom Sauvignon Blanc',
      slug: 'barrel-bloom-sauvignon-blanc',
      category: 'wine',
      brand: 'barrel-bloom',
      price: 28,
      stock: 66,
      images: imageBank.wine,
      abv: 12.5,
      volume: 750,
      description: 'Crisp citrus, lime zest, and a clean mineral edge.',
      tags: ['sauvignon', 'white', 'crisp'],
    },
    {
      name: 'Copper Coast Rose',
      slug: 'copper-coast-rose',
      category: 'wine',
      brand: 'copper-coast',
      price: 24,
      stock: 74,
      images: imageBank.wine,
      abv: 12,
      volume: 750,
      description: 'Fresh strawberry and floral notes with bright acidity.',
      tags: ['rose', 'fresh', 'summer'],
    },
    {
      name: 'Midnight Oak Sparkling Brut',
      slug: 'midnight-oak-sparkling-brut',
      category: 'wine',
      brand: 'midnight-oak',
      price: 32,
      stock: 58,
      images: imageBank.wine,
      abv: 12,
      volume: 750,
      description: 'Fine bubbles with green apple and brioche.',
      tags: ['sparkling', 'brut', 'celebration'],
    },
    {
      name: 'Silver Crest Pilsner',
      slug: 'silver-crest-pilsner',
      category: 'beer',
      brand: 'silver-crest',
      price: 14,
      stock: 120,
      images: imageBank.beer,
      abv: 5,
      volume: 355,
      description: 'Crisp pilsner with clean hop bitterness.',
      tags: ['pilsner', 'crisp', 'classic'],
    },
    {
      name: 'Copper Coast IPA',
      slug: 'copper-coast-ipa',
      category: 'beer',
      brand: 'copper-coast',
      price: 16,
      stock: 110,
      images: imageBank.beer,
      abv: 6.5,
      volume: 355,
      description: 'Citrus-forward IPA with piney hops.',
      tags: ['ipa', 'hoppy', 'citrus'],
    },
    {
      name: 'Golden Reserve Amber Lager',
      slug: 'golden-reserve-amber-lager',
      category: 'beer',
      brand: 'golden-reserve',
      price: 13,
      stock: 130,
      images: imageBank.beer,
      abv: 5.2,
      volume: 355,
      description: 'Malty amber lager with toasted bread notes.',
      tags: ['lager', 'amber', 'malty'],
    },
    {
      name: 'Midnight Oak Stout',
      slug: 'midnight-oak-stout',
      category: 'beer',
      brand: 'midnight-oak',
      price: 18,
      stock: 88,
      images: imageBank.beer,
      abv: 7.2,
      volume: 355,
      description: 'Roasted coffee, dark chocolate, and a creamy finish.',
      tags: ['stout', 'coffee', 'rich'],
    },
  ].map((product) => ({
    ...product,
    categoryId: categoryBySlug[product.category]._id,
    brandId: brandBySlug[product.brand]._id,
  }));

  await Product.insertMany(sampleProducts);

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  const adminPassword = await hashPassword('AdminPass1', saltRounds);
  const staffPassword = await hashPassword('StaffPass1', saltRounds);
  const customerPassword = await hashPassword('CustomerPass1', saltRounds);

  await User.insertMany([
    {
      email: 'admin@goldenbarrel.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      dob: new Date('1990-01-01'),
      isAgeVerified: true,
      role: 'ADMIN',
    },
    {
      email: 'staff@goldenbarrel.com',
      passwordHash: staffPassword,
      name: 'Staff User',
      dob: new Date('1992-01-01'),
      isAgeVerified: true,
      role: 'STAFF',
    },
    {
      email: 'customer@goldenbarrel.com',
      passwordHash: customerPassword,
      name: 'Customer User',
      dob: new Date('1995-01-01'),
      isAgeVerified: true,
      role: 'CUSTOMER',
    },
  ]);

  await mongoose.disconnect();
  console.log('Seed complete');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

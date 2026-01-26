import 'reflect-metadata';
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

  const sampleProducts = Array.from({ length: 20 }).map((_, idx) => {
    const category = categories[idx % categories.length];
    const brand = brands[idx % brands.length];
    return {
      name: `Golden Barrel Select ${idx + 1}`,
      slug: `golden-barrel-select-${idx + 1}`,
      categoryId: category._id,
      brandId: brand._id,
      price: 30 + idx * 2,
      discountPrice: idx % 3 === 0 ? 25 + idx : undefined,
      stock: 25 + idx,
      images: [
        'https://placehold.co/600x800/png',
        'https://placehold.co/600x800/png?2',
      ],
      abv: 38 + (idx % 10),
      volume: 750,
      description: 'Small batch spirit with rich notes of oak, caramel, and spice.',
      tags: ['premium', 'limited', 'barrel-aged'],
    };
  });

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
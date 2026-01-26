import Link from 'next/link';
import { ProductCard, Product } from '../components/ProductCard';

const featured: Product[] = [
  {
    _id: '1',
    name: 'Royal Oak Reserve',
    slug: 'royal-oak-reserve',
    price: 84,
    discountPrice: 72,
    images: ['https://placehold.co/600x800/png'],
    abv: 46,
    volume: 750,
  },
  {
    _id: '2',
    name: 'Velvet Rye 12',
    slug: 'velvet-rye-12',
    price: 96,
    images: ['https://placehold.co/600x800/png?2'],
    abv: 48,
    volume: 750,
  },
  {
    _id: '3',
    name: 'Amber Coast Rum',
    slug: 'amber-coast-rum',
    price: 58,
    images: ['https://placehold.co/600x800/png?3'],
    abv: 40,
    volume: 750,
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold-200">Golden Barrel</p>
          <h1 className="display mt-4 text-4xl md:text-6xl">
            Curated Spirits for the Modern Connoisseur
          </h1>
          <p className="mt-4 text-sm text-[#cfc7bc]">
            Discover rare releases, small-batch expressions, and luxurious pairings in a dark, golden
            atmosphere.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black"
            >
              Shop Collection
            </Link>
            <Link
              href="/products?sort=newest"
              className="rounded-full border border-gold-400 px-6 py-3 text-sm font-semibold text-gold-200"
            >
              New Arrivals
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gold-500/10 blur-2xl" />
          <img
            src="https://placehold.co/700x900/png"
            alt="Golden Barrel premium bottle"
            className="relative rounded-3xl border border-gold-400/30 shadow-glow"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">Featured Categories</h2>
          <Link href="/products" className="text-sm text-gold-200">View all</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Whisky', 'Vodka', 'Wine'].map((cat) => (
            <div key={cat} className="glass rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8c8378]">Collection</p>
              <h3 className="display mt-3 text-xl text-gold-200">{cat}</h3>
              <p className="mt-2 text-sm text-[#cfc7bc]">Limited runs and cellar finds.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">Best Sellers</h2>
          <Link href="/products?sort=bestSelling" className="text-sm text-gold-200">See all</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">New Arrivals</h2>
          <Link href="/products?sort=newest" className="text-sm text-gold-200">See all</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="glass rounded-2xl p-4">
              <img src="https://placehold.co/400x500/png" alt="New arrival" className="rounded-xl" />
              <p className="mt-3 text-sm text-gold-200">Vault Series {idx + 1}</p>
              <p className="text-xs text-[#8c8378]">Single barrel</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
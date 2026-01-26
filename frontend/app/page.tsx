import Link from 'next/link';
import { ProductCard, Product } from '../components/ProductCard';

const featured: Product[] = [
  {
    _id: '1',
    name: 'Royal Oak Reserve',
    slug: 'royal-oak-reserve',
    price: 84,
    discountPrice: 72,
    images: ['https://unsplash.com/photos/LVotgZ43LLU/download?auto=format&fit=crop&w=800&q=80'],
    abv: 46,
    volume: 750,
  },
  {
    _id: '2',
    name: 'Velvet Rye 12',
    slug: 'velvet-rye-12',
    price: 96,
    images: ['https://unsplash.com/photos/I-fuIPC441I/download?auto=format&fit=crop&w=800&q=80'],
    abv: 48,
    volume: 750,
  },
  {
    _id: '3',
    name: 'Amber Coast Rum',
    slug: 'amber-coast-rum',
    price: 58,
    images: ['https://unsplash.com/photos/N0uCG9nP2bQ/download?auto=format&fit=crop&w=800&q=80'],
    abv: 40,
    volume: 750,
  },
];

const brandShowcase = [
  {
    name: 'Johnnie Walker',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Johnnie_Walker_wordmark.svg',
  },
  {
    name: 'Colombo Gin',
    image:
      'https://images.squarespace-cdn.com/content/v1/61015b0a1f9d486bc677fe4c/1628094957503-VIPXXA01UEPTO2M498JQ/Colombo%2BGin-min.png',
  },
  {
    name: "Jacob's Creek",
    image: 'https://www.jacobscreek.com/wp-content/uploads/sites/7/2021/01/Logo-naked.png',
  },
  {
    name: 'The Macallan',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/The_Macallan_brand_line.png',
  },
  {
    name: 'Absolut',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Logo-absolut.svg',
  },
  {
    name: 'Jam Jar',
    image:
      'https://images.squarespace-cdn.com/content/v1/60629f9bd6699a4ea2cebcff/0914a575-724c-4d3d-8fab-96c8c71442e4/MicrosoftTeams-image%2B%2862%29.png',
  },
  {
    name: 'Moet & Chandon',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Logo_Mo%C3%ABt_%26_Chandon_2025.png',
  },
  {
    name: 'Glenfiddich',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Glenfiddich_Text_Logo.svg',
  },
  {
    name: "Jack Daniel's",
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Jackdaniels.jpg',
  },
  {
    name: 'Heineken',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Heineken_logo_%281%29.png',
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
            src="https://unsplash.com/photos/XcBLhA7N0wc/download?auto=format&fit=crop&w=900&q=80"
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="display text-2xl">Shop by Brand</h2>
          <Link
            href="/products"
            className="rounded-lg border border-gold-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-200"
          >
            View More
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {brandShowcase.map((brand) => (
            <div
              key={brand.name}
              className="flex min-h-[110px] items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-5"
            >
              <div className="flex min-h-[64px] w-full items-center justify-center rounded-xl bg-white/95 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                <img
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  className="max-h-12 w-auto object-contain"
                  loading="lazy"
                />
              </div>
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
              <img
                src="https://unsplash.com/photos/Q2tgNTnE54U/download?auto=format&fit=crop&w=800&q=80"
                alt="New arrival"
                className="rounded-xl"
              />
              <p className="mt-3 text-sm text-gold-200">Vault Series {idx + 1}</p>
              <p className="text-xs text-[#8c8378]">Single barrel</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

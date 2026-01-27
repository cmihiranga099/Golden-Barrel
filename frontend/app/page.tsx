import Link from 'next/link';
import { ProductCard, Product } from '../components/ProductCard';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchProducts(path: string): Promise<Product[]> {
  try {
    const res = await fetch(`${apiBase}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json;
  } catch {
    return [];
  }
}

const brandShowcase = [
  {
    name: 'Johnnie Walker',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Johnnie_Walker_wordmark.svg',
    slug: 'johnnie-walker',
  },
  {
    name: 'Colombo Gin',
    image: '/Company-Colombo.jpg',
    slug: 'colombo',
  },
  {
    name: "Jacob's Creek",
    image: '/Jacobs_Creek.png',
    slug: 'jacobs-creek',
  },
  {
    name: 'The Macallan',
    image: '/the-macallan-logo.png',
    slug: 'the-macallan',
  },
  {
    name: 'Absolut',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Logo-absolut.svg',
    slug: 'absolut',
  },
  {
    name: 'Jam Jar',
    image: '/jam jar.png',
    slug: 'jam-jar',
  },
  {
    name: 'Moet & Chandon',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Logo_Mo%C3%ABt_%26_Chandon_2025.png',
    slug: 'moet-chandon',
  },
  {
    name: 'Glenfiddich',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Glenfiddich_Text_Logo.svg',
    slug: 'glenfiddich',
  },
  {
    name: "Jack Daniel's",
    image: '/jackdaniels.png',
    slug: 'jack-daniels',
  },
  {
    name: 'Heineken',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Heineken_logo_%281%29.png',
    slug: 'heineken',
  },
];

export default async function HomePage() {
  const [bestSellers, newArrivals] = await Promise.all([
    fetchProducts('/products?sort=bestSelling'),
    fetchProducts('/products?sort=newest'),
  ]);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold-200">Golden Barrel</p>
          <h1 className="display mt-4 text-4xl md:text-6xl">
            Curated Spirits for the Modern Connoisseur
          </h1>
          <p className="mt-4 text-sm text-[#4f4338]">
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
        <div className="relative flex justify-center md:justify-end">
          <div className="absolute -inset-4 rounded-3xl bg-gold-500/10 blur-2xl" />
          <img
            src="/hero.jpg"
            alt="Golden Barrel premium bottle"
            className="relative h-[360px] w-full max-w-[420px] rounded-3xl border border-gold-400/30 object-cover shadow-glow md:h-[420px]"
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
              <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Collection</p>
              <h3 className="display mt-3 text-xl text-gold-200">{cat}</h3>
              <p className="mt-2 text-sm text-[#4f4338]">Limited runs and cellar finds.</p>
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
            <Link
              key={brand.name}
              href={`/products?brand=${brand.slug}`}
              className="flex min-h-[110px] items-center justify-center rounded-2xl border border-black/10 bg-white/70 p-5 transition hover:border-gold-400"
            >
              <img
                src={brand.image}
                alt={`${brand.name} logo`}
                className="max-h-12 w-auto object-contain opacity-90 transition duration-200 hover:opacity-100"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">Best Sellers</h2>
          <Link href="/products?sort=bestSelling" className="text-sm text-gold-200">See all</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {(bestSellers.length ? bestSellers.slice(0, 3) : []).map((product) => (
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
          {(newArrivals.length ? newArrivals.slice(0, 4) : []).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

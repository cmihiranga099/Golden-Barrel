import Link from 'next/link';
import { apiGet } from '../../lib/api';
import { ProductCard, Product } from '../../components/ProductCard';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const normalized: Record<string, string> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') normalized[key] = value;
  });
  const query = new URLSearchParams(normalized).toString();
  let products: Product[] = [];
  try {
    products = await apiGet<Product[]>(`/products?${query}`);
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h1 className="display text-3xl">All Spirits</h1>
        <div className="flex flex-wrap gap-3">
          {['newest', 'priceLow', 'priceHigh', 'rating'].map((sort) => (
            <Link
              key={sort}
              href={`/products?sort=${sort}`}
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest"
            >
              {sort}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[240px,1fr]">
        <aside className="glass rounded-2xl p-4 text-sm text-[#cfc7bc]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8c8378]">Filters</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-[#8c8378]">Category</p>
              <div className="mt-2 space-y-1">
                {['Whisky', 'Vodka', 'Rum', 'Wine', 'Beer'].map((cat) => (
                  <Link key={cat} href={`/products?category=${cat.toLowerCase()}`} className="block hover:text-gold-200">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#8c8378]">Price Range</p>
              <div className="mt-2 flex gap-2">
                <input className="w-full rounded-md bg-black/40 p-2 text-xs" placeholder="$ min" />
                <input className="w-full rounded-md bg-black/40 p-2 text-xs" placeholder="$ max" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#8c8378]">Alcohol %</p>
              <div className="mt-2 flex gap-2">
                <input className="w-full rounded-md bg-black/40 p-2 text-xs" placeholder="min" />
                <input className="w-full rounded-md bg-black/40 p-2 text-xs" placeholder="max" />
              </div>
            </div>
          </div>
        </aside>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.length ? (
            products.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <p className="text-sm text-[#8c8378]">No products found yet. Seed the database to see items.</p>
          )}
        </div>
      </div>
    </div>
  );
}

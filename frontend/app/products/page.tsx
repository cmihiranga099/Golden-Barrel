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
  let categories: any[] = [];
  let brands: any[] = [];
  try {
    products = await apiGet<Product[]>(`/products?${query}`);
    categories = await apiGet<any[]>('/categories');
    brands = await apiGet<any[]>('/brands');
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h1 className="display text-3xl">All Spirits</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['newest', 'priceLow', 'priceHigh', 'rating', 'bestSelling'].map((sort) => (
            <Link
              key={sort}
              href={`/products?sort=${sort}`}
              className="rounded-full border border-black/10 px-4 py-2 text-[10px] uppercase tracking-widest sm:text-xs"
            >
              {sort}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px,1fr]">
        <aside className="glass self-start rounded-2xl p-4 text-sm text-[#4f4338]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Filters</p>
          <form className="mt-4 space-y-4" method="GET" action="/products">
            <input type="hidden" name="sort" value={normalized.sort || ''} />
            <div>
              <p className="text-xs text-[#6f6256]">Search</p>
              <input
                name="q"
                defaultValue={normalized.q || ''}
                className="mt-2 w-full rounded-md bg-white/70 p-2 text-xs"
                placeholder="Search by name, brand, or tag"
              />
            </div>
            <div>
              <p className="text-xs text-[#6f6256]">Category</p>
              <select
                name="category"
                defaultValue={normalized.category || ''}
                className="mt-2 w-full rounded-md bg-white/70 p-2 text-xs"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs text-[#6f6256]">Brand</p>
              <select
                name="brand"
                defaultValue={normalized.brand || ''}
                className="mt-2 w-full rounded-md bg-white/70 p-2 text-xs"
              >
                <option value="">All</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.slug}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs text-[#6f6256]">Price Range</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  name="minPrice"
                  defaultValue={normalized.minPrice || ''}
                  className="w-full rounded-md bg-white/70 p-2 text-xs"
                  placeholder="$ min"
                />
                <input
                  name="maxPrice"
                  defaultValue={normalized.maxPrice || ''}
                  className="w-full rounded-md bg-white/70 p-2 text-xs"
                  placeholder="$ max"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#6f6256]">Alcohol %</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  name="abvMin"
                  defaultValue={normalized.abvMin || ''}
                  className="w-full rounded-md bg-white/70 p-2 text-xs"
                  placeholder="min"
                />
                <input
                  name="abvMax"
                  defaultValue={normalized.abvMax || ''}
                  className="w-full rounded-md bg-white/70 p-2 text-xs"
                  placeholder="max"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#6f6256]">Volume (ml)</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  name="volumeMin"
                  defaultValue={normalized.volumeMin || ''}
                  className="w-full rounded-md bg-white/70 p-2 text-xs"
                  placeholder="min"
                />
                <input
                  name="volumeMax"
                  defaultValue={normalized.volumeMax || ''}
                  className="w-full rounded-md bg-white/70 p-2 text-xs"
                  placeholder="max"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#6f6256]">
              <input type="checkbox" name="inStock" defaultChecked={!!normalized.inStock} />
              In stock only
            </label>
            <button className="w-full rounded-full border border-gold-400 px-4 py-2 text-xs text-gold-200">
              Apply Filters
            </button>
          </form>
        </aside>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.length ? (
            products.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <p className="text-sm text-[#6f6256]">No products found yet. Seed the database to see items.</p>
          )}
        </div>
      </div>
    </div>
  );
}

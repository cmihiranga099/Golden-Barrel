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
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h1 className="display text-3xl">All Spirits</h1>
        <div className="flex flex-wrap gap-3">
          {['newest', 'priceLow', 'priceHigh', 'rating', 'bestSelling'].map((sort) => (
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
          <form className="mt-4 space-y-4" method="GET" action="/products">
            <input type="hidden" name="sort" value={normalized.sort || ''} />
            <div>
              <p className="text-xs text-[#8c8378]">Search</p>
              <input
                name="q"
                defaultValue={normalized.q || ''}
                className="mt-2 w-full rounded-md bg-black/40 p-2 text-xs"
                placeholder="Search by name, brand, or tag"
              />
            </div>
            <div>
              <p className="text-xs text-[#8c8378]">Category</p>
              <select
                name="category"
                defaultValue={normalized.category || ''}
                className="mt-2 w-full rounded-md bg-black/40 p-2 text-xs"
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
              <p className="text-xs text-[#8c8378]">Brand</p>
              <select
                name="brand"
                defaultValue={normalized.brand || ''}
                className="mt-2 w-full rounded-md bg-black/40 p-2 text-xs"
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
              <p className="text-xs text-[#8c8378]">Price Range</p>
              <div className="mt-2 flex gap-2">
                <input
                  name="minPrice"
                  defaultValue={normalized.minPrice || ''}
                  className="w-full rounded-md bg-black/40 p-2 text-xs"
                  placeholder="$ min"
                />
                <input
                  name="maxPrice"
                  defaultValue={normalized.maxPrice || ''}
                  className="w-full rounded-md bg-black/40 p-2 text-xs"
                  placeholder="$ max"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#8c8378]">Alcohol %</p>
              <div className="mt-2 flex gap-2">
                <input
                  name="abvMin"
                  defaultValue={normalized.abvMin || ''}
                  className="w-full rounded-md bg-black/40 p-2 text-xs"
                  placeholder="min"
                />
                <input
                  name="abvMax"
                  defaultValue={normalized.abvMax || ''}
                  className="w-full rounded-md bg-black/40 p-2 text-xs"
                  placeholder="max"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#8c8378]">Volume (ml)</p>
              <div className="mt-2 flex gap-2">
                <input
                  name="volumeMin"
                  defaultValue={normalized.volumeMin || ''}
                  className="w-full rounded-md bg-black/40 p-2 text-xs"
                  placeholder="min"
                />
                <input
                  name="volumeMax"
                  defaultValue={normalized.volumeMax || ''}
                  className="w-full rounded-md bg-black/40 p-2 text-xs"
                  placeholder="max"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#8c8378]">
              <input type="checkbox" name="inStock" defaultChecked={!!normalized.inStock} />
              In stock only
            </label>
            <button className="w-full rounded-full border border-gold-400 px-4 py-2 text-xs text-gold-200">
              Apply Filters
            </button>
          </form>
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

import Link from 'next/link';
import { apiGet } from '../../lib/api';
import { ProductCard, Product } from '../../components/ProductCard';

export default async function ProductsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const query = new URLSearchParams(searchParams).toString();
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
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {products.length ? (
          products.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <p className="text-sm text-[#8c8378]">No products found yet. Seed the database to see items.</p>
        )}
      </div>
    </div>
  );
}
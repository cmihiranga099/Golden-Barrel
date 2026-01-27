import { apiGet } from '../../../lib/api';
import { Product, ProductCard } from '../../../components/ProductCard';
import { AddToCart } from '../../../components/ui/AddToCart';
import { ProductReviews } from '../../../components/ProductReviews';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: Product | null = null;
  let bestSellers: Product[] = [];
  let newArrivals: Product[] = [];
  try {
    product = await apiGet<Product>(`/products/${params.slug}`);
  } catch {
    product = null;
  }
  try {
    bestSellers = await apiGet<Product[]>('/products?sort=bestSelling');
    newArrivals = await apiGet<Product[]>('/products?sort=newest');
  } catch {
    bestSellers = [];
    newArrivals = [];
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm text-[#6f6256]">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="grid gap-4">
          {product.images?.slice(0, 2).map((img, idx) => (
            <img key={idx} src={img} alt={product.name} className="rounded-2xl border border-black/10" />
          ))}
        </div>
        <div>
          <h1 className="display text-3xl text-gold-200">{product.name}</h1>
          <p className="mt-2 text-xs text-[#6f6256]">
            {product.categoryId?.name || 'Category'} | {product.brandId?.name || 'Brand'}
          </p>
          <p className="mt-2 text-sm text-[#6f6256]">{product.abv}% ABV | {product.volume}ml</p>
          <div className="mt-6 flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-semibold text-gold-200">${product.discountPrice}</span>
                <span className="text-sm text-[#6f6256] line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-gold-200">${product.price}</span>
            )}
          </div>
          <p className="mt-3 text-xs text-[#6f6256]">
            {(product.ratingAverage || 0).toFixed(1)} stars | {product.ratingCount || 0} reviews
          </p>
          <p className="mt-6 text-sm text-[#4f4338]">
            {product.description || 'Refined, balanced, and ready for your collection.'}
          </p>
          {product.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-black/10 px-3 py-1 text-xs text-[#6f6256]">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <p className="mt-4 text-xs text-[#6f6256]">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
      <div className="mt-12">
        <ProductReviews productId={product._id} />
      </div>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">Best Sellers</h2>
          <a href="/products?sort=bestSelling" className="text-sm text-gold-200">See all</a>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {bestSellers.slice(0, 3).map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">New Arrivals</h2>
          <a href="/products?sort=newest" className="text-sm text-gold-200">See all</a>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {newArrivals.slice(0, 4).map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

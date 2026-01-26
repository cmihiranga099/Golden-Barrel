import { apiGet } from '../../../lib/api';
import { Product } from '../../../components/ProductCard';
import { AddToCart } from '../../../components/ui/AddToCart';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: Product | null = null;
  try {
    product = await apiGet<Product>(`/products/${params.slug}`);
  } catch {
    product = null;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm text-[#8c8378]">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="grid gap-4">
          {product.images?.slice(0, 2).map((img, idx) => (
            <img key={idx} src={img} alt={product.name} className="rounded-2xl border border-white/5" />
          ))}
        </div>
        <div>
          <h1 className="display text-3xl text-gold-200">{product.name}</h1>
          <p className="mt-2 text-sm text-[#8c8378]">{product.abv}% ABV • {product.volume}ml</p>
          <div className="mt-6 flex items-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-semibold text-gold-200">${product.discountPrice}</span>
                <span className="text-sm text-[#8c8378] line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-gold-200">${product.price}</span>
            )}
          </div>
          <p className="mt-6 text-sm text-[#cfc7bc]">
            Crafted for collectors and casual tastings alike, this bottle offers layered notes of oak,
            spice, and dark fruit.
          </p>
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
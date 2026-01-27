import Link from 'next/link';

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  abv: number;
  volume: number;
  description?: string;
  ratingAverage?: number;
  ratingCount?: number;
  stock?: number;
  tags?: string[];
  categoryId?: { name?: string } | string;
  brandId?: { name?: string } | string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/90">
        <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[#f7f2ea]">
          <img
            src={
              product.images?.[0] ||
              'https://unsplash.com/photos/LVotgZ43LLU/download?auto=format&fit=crop&w=800&q=80'
            }
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="display text-lg text-gold-200">{product.name}</h3>
          <p className="mt-1 text-xs text-[#6f6256]">
            {product.abv}% ABV | {product.volume}ml
          </p>
          <div className="mt-4 flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-semibold text-gold-200">${product.discountPrice}</span>
                <span className="text-xs text-[#6f6256] line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-gold-200">${product.price}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

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
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-night-800">
        <div className="h-64 w-full overflow-hidden">
          <img
            src={
              product.images?.[0] ||
              'https://images.unsplash.com/photo-1608356237786-395cbb86c366?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjYyOTd8MHwxfHNlYXJjaHw0fHx3aGlza2V5JTIwYm90dGxlfGVufDB8fHx8MTc1MTY2NTY1Nnww&ixlib=rb-4.1.0&q=85'
            }
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="display text-lg text-gold-200">{product.name}</h3>
          <p className="mt-1 text-xs text-[#8c8378]">
            {product.abv}% ABV | {product.volume}ml
          </p>
          <div className="mt-4 flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-semibold text-gold-200">${product.discountPrice}</span>
                <span className="text-xs text-[#8c8378] line-through">${product.price}</span>
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

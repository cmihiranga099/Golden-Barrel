'use client';

import { Product } from '../ProductCard';
import { useCartStore } from '../../lib/store';
import { useToast } from './ToastProvider';

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { push } = useToast();

  return (
    <button
      className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black"
      onClick={() => {
        addItem({
          productId: product._id,
          name: product.name,
          price: product.discountPrice || product.price,
          quantity: 1,
          image: product.images?.[0],
        });
        push('Added to cart');
      }}
    >
      Add to Cart
    </button>
  );
}
'use client';

import { Product } from '../ProductCard';
import { useCartStore, useWishlistStore } from '../../lib/store';
import { addCartItem } from '../../lib/cart-api';
import { getTokens } from '../../lib/auth';
import { useToast } from './ToastProvider';

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { add } = useWishlistStore();
  const { push } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
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
        if (getTokens()?.accessToken) {
          addCartItem(product._id, 1).catch(() => {});
        }
        push('Added to cart');
      }}
      >
        Add to Cart
      </button>
      <button
        className="rounded-full border border-gold-400 px-6 py-3 text-sm font-semibold text-gold-200"
        onClick={() => {
          add({ productId: product._id, name: product.name, image: product.images?.[0] });
          push('Saved to wishlist');
        }}
      >
        Save to Wishlist
      </button>
    </div>
  );
}

'use client';

import { useWishlistStore } from '../../../lib/store';

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="display text-3xl">Wishlist</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-[#8c8378]">Your wishlist is empty.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.productId} className="glass flex items-center justify-between rounded-2xl p-4">
              <div>
                <p className="text-gold-200">{item.name}</p>
                <p className="text-xs text-[#8c8378]">Saved for later</p>
              </div>
              <button onClick={() => remove(item.productId)} className="text-xs text-[#8c8378]">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
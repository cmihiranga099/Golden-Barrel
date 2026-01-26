'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '../../../lib/store';
import { fetchWishlist, removeWishlistItem } from '../../../lib/wishlist-api';
import { getTokens } from '../../../lib/auth';

export default function WishlistPage() {
  const { items, remove, setItems } = useWishlistStore();

  useEffect(() => {
    if (getTokens()?.accessToken) {
      fetchWishlist()
        .then((wishlist: any) => {
          const mapped = (wishlist.items || []).map((item: any) => ({
            productId: item.productId?._id || item.productId,
            name: item.productId?.name || 'Item',
            image: item.productId?.images?.[0],
          }));
          setItems(mapped);
        })
        .catch(() => {});
    }
  }, []);

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
              <button
                onClick={() => {
                  remove(item.productId);
                  if (getTokens()?.accessToken) {
                    removeWishlistItem(item.productId).catch(() => {});
                  }
                }}
                className="text-xs text-[#8c8378]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

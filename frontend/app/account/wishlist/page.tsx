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
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
      <div className="rounded-3xl border border-gold-400/20 bg-night-900/95 p-6 shadow-lg sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#b7a590]">Wishlist</p>
        <h1 className="display mt-2 text-3xl text-gold-200">Saved Items</h1>
      </div>
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-[#b7a590]">Your wishlist is empty.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col gap-3 rounded-2xl border border-gold-400/20 bg-night-800/90 p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-gold-200">{item.name}</p>
                <p className="text-xs text-[#b7a590]">Saved for later</p>
              </div>
              <button
                onClick={() => {
                  remove(item.productId);
                  if (getTokens()?.accessToken) {
                    removeWishlistItem(item.productId).catch(() => {});
                  }
                }}
                className="text-xs text-[#b7a590]"
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

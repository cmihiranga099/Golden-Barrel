'use client';

import { useEffect } from 'react';
import { useCartStore } from '../../lib/store';
import Link from 'next/link';
import { fetchCart, removeCartItem, updateCartItem } from '../../lib/cart-api';
import { getTokens } from '../../lib/auth';

export default function CartPage() {
  const { items, updateQty, removeItem, setItems } = useCartStore();

  useEffect(() => {
    if (getTokens()?.accessToken) {
      fetchCart()
        .then((cart: any) => {
          const mapped = (cart.items || []).map((item: any) => ({
            productId: item.productId?._id || item.productId,
            name: item.productId?.name || 'Item',
            price: item.productId?.discountPrice || item.productId?.price || 0,
            quantity: item.quantity,
            image: item.productId?.images?.[0],
          }));
          setItems(mapped);
        })
        .catch(() => {});
    }
  }, [setItems]);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="display text-3xl">Your Cart</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-[#6f6256]">Your cart is empty.</p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="glass flex items-center justify-between rounded-2xl p-4">
                <div>
                  <p className="text-gold-200">{item.name}</p>
                  <p className="text-xs text-[#6f6256]">${item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      updateQty(item.productId, qty);
                      if (getTokens()?.accessToken) {
                        updateCartItem(item.productId, qty).catch(() => {});
                      }
                    }}
                    className="w-16 rounded-md bg-white/70 p-2 text-center"
                  />
                  <button
                    onClick={() => {
                      removeItem(item.productId);
                      if (getTokens()?.accessToken) {
                        removeCartItem(item.productId).catch(() => {});
                      }
                    }}
                    className="text-xs text-[#6f6256]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[#6f6256]">Subtotal</p>
            <p className="mt-2 text-2xl text-gold-200">${subtotal.toFixed(2)}</p>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-gold-500 px-6 py-3 text-center text-sm font-semibold text-black"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

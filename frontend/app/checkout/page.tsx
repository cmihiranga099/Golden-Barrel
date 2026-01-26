'use client';

import { useState } from 'react';
import { useCartStore } from '../../lib/store';
import { useToast } from '../../components/ui/ToastProvider';
import { createOrder, createPaymentIntent } from '../../lib/checkout';

export default function CheckoutPage() {
  const { items, clear } = useCartStore();
  const { push } = useToast();
  const [dob, setDob] = useState('');
  const [confirmAge, setConfirmAge] = useState(false);
  const [method, setMethod] = useState<'STRIPE' | 'COD'>('STRIPE');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 120 ? 0 : 12;
  const total = subtotal + shipping;

  const handleSubmit = async () => {
    if (!dob || !confirmAge) {
      push('Please confirm your date of birth and legal drinking age.');
      return;
    }
    if (!items.length) {
      push('Your cart is empty.');
      return;
    }
    try {
      let paymentIntentId: string | undefined;
      if (method === 'STRIPE') {
        const intent = await createPaymentIntent(Math.round(total * 100), 'usd');
        paymentIntentId = intent.id;
      }

      await createOrder({
        items,
        subtotal,
        discountTotal: 0,
        shippingFee: shipping,
        total,
        paymentMethod: method,
        paymentIntentId,
        shipping: {
          name: 'Customer',
          line1: '123 Barrel St',
          city: 'Napa',
          state: 'CA',
          postalCode: '94558',
          country: 'US',
        },
      });
      push(
        method === 'STRIPE'
          ? 'Payment initiated. Complete payment in Stripe Elements in production.'
          : 'Order placed. A confirmation email will be sent shortly.',
      );
      clear();
    } catch {
      push('Checkout failed. Please sign in.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="display text-3xl">Checkout</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="display text-xl text-gold-200">Delivery Details</h2>
            <div className="mt-4 grid gap-3">
              <input className="rounded-md bg-black/40 p-3" placeholder="Full name" />
              <input className="rounded-md bg-black/40 p-3" placeholder="Street address" />
              <div className="grid gap-3 md:grid-cols-2">
                <input className="rounded-md bg-black/40 p-3" placeholder="City" />
                <input className="rounded-md bg-black/40 p-3" placeholder="State" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input className="rounded-md bg-black/40 p-3" placeholder="Postal code" />
                <input className="rounded-md bg-black/40 p-3" placeholder="Country" />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="display text-xl text-gold-200">Age Confirmation</h2>
            <div className="mt-4 grid gap-3">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="rounded-md bg-black/40 p-3"
              />
              <label className="flex items-center gap-2 text-sm text-[#cfc7bc]">
                <input
                  type="checkbox"
                  checked={confirmAge}
                  onChange={(e) => setConfirmAge(e.target.checked)}
                />
                I confirm I am of legal drinking age.
              </label>
            </div>
            <p className="mt-3 text-xs text-[#8c8378]">
              Orders are only accepted for customers of legal drinking age. Please drink responsibly.
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="display text-xl text-gold-200">Payment Method</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={method === 'STRIPE'}
                  onChange={() => setMethod('STRIPE')}
                />
                Stripe Card Payment
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={method === 'COD'}
                  onChange={() => setMethod('COD')}
                />
                Cash on Delivery
              </label>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-[#cfc7bc]">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between text-gold-200"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black"
          >
            Place Order
          </button>
          <p className="mt-4 text-xs text-[#8c8378]">
            By placing this order, you confirm you are of legal drinking age and accept our policies.
          </p>
        </div>
      </div>
    </div>
  );
}

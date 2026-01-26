'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../lib/store';
import { useToast } from '../../components/ui/ToastProvider';
import { createOrder, createPaymentIntent } from '../../lib/checkout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

function StripeForm({
  clientSecret,
  onSuccess,
}: {
  clientSecret: string;
  onSuccess: () => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const confirmPayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });
    setLoading(false);
    if (result.error) {
      throw new Error(result.error.message);
    }
    await onSuccess();
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <button
        onClick={confirmPayment}
        disabled={!stripe || loading}
        className="w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, clear } = useCartStore();
  const { push } = useToast();
  const router = useRouter();
  const [dob, setDob] = useState('');
  const [confirmAge, setConfirmAge] = useState(false);
  const [method, setMethod] = useState<'STRIPE' | 'COD'>('STRIPE');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | undefined>(undefined);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 120 ? 0 : 12;
  const total = subtotal + shipping;

  const stripePromise = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    return key ? loadStripe(key) : null;
  }, []);

  useEffect(() => {
    setClientSecret(null);
    setPaymentIntentId(undefined);
  }, [method, total]);

  const placeOrder = async () => {
    const order = await createOrder({
      items,
      subtotal,
      discountTotal: 0,
      shippingFee: shipping,
      total,
      paymentMethod: method,
      paymentIntentId,
      shipping: shippingInfo,
    });
    push(
      method === 'STRIPE'
        ? 'Payment completed. Order confirmed.'
        : 'Order placed. A confirmation email will be sent shortly.',
    );
    clear();
    if (order?._id) {
      router.push(`/checkout/confirmation?orderId=${order._id}`);
    }
  };

  const handleSubmit = async () => {
    if (!dob || !confirmAge) {
      push('Please confirm your date of birth and legal drinking age.');
      return;
    }
    if (!items.length) {
      push('Your cart is empty.');
      return;
    }
    if (!shippingInfo.name || !shippingInfo.line1 || !shippingInfo.city) {
      push('Please complete shipping details.');
      return;
    }
    if (method === 'COD') {
      try {
        await placeOrder();
      } catch {
        push('Checkout failed. Please sign in.');
      }
      return;
    }
    try {
      const intent = await createPaymentIntent(Math.round(total * 100), 'usd');
      setClientSecret(intent.client_secret);
      setPaymentIntentId(intent.id);
    } catch {
      push('Stripe setup failed.');
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
              <input
                className="rounded-md bg-black/40 p-3"
                placeholder="Full name"
                value={shippingInfo.name}
                onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
              />
              <input
                className="rounded-md bg-black/40 p-3"
                placeholder="Street address"
                value={shippingInfo.line1}
                onChange={(e) => setShippingInfo({ ...shippingInfo, line1: e.target.value })}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="rounded-md bg-black/40 p-3"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                />
                <input
                  className="rounded-md bg-black/40 p-3"
                  placeholder="State"
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="rounded-md bg-black/40 p-3"
                  placeholder="Postal code"
                  value={shippingInfo.postalCode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                />
                <input
                  className="rounded-md bg-black/40 p-3"
                  placeholder="Country"
                  value={shippingInfo.country}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                />
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
            {method === 'STRIPE' && clientSecret && stripePromise && (
              <div className="mt-6">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeForm clientSecret={clientSecret} onSuccess={placeOrder} />
                </Elements>
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-[#cfc7bc]">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between text-gold-200"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          {!clientSecret && (
            <button
              onClick={handleSubmit}
              className="mt-6 w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black"
            >
              {method === 'STRIPE' ? 'Continue to Payment' : 'Place Order'}
            </button>
          )}
          <p className="mt-4 text-xs text-[#8c8378]">
            By placing this order, you confirm you are of legal drinking age and accept our policies.
          </p>
        </div>
      </div>
    </div>
  );
}

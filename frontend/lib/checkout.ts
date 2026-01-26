import { apiGet, apiPost } from '../../lib/api';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderInput = {
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'STRIPE' | 'COD';
  paymentIntentId?: string;
  shipping: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

export async function createPaymentIntent(amount: number, currency = 'usd', orderId?: string) {
  return apiPost<{ client_secret: string; id: string }>(`/payments/intent`, {
    amount,
    currency,
    orderId,
  });
}

export async function createOrder(payload: OrderInput) {
  return apiPost('/orders', payload);
}

export async function listOrders() {
  return apiGet('/orders/me');
}

export async function getOrder(id: string) {
  return apiGet(`/orders/${id}`);
}

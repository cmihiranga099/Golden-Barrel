import { apiGet, apiPost } from './api';

export async function fetchCart() {
  return apiGet('/cart');
}

export async function addCartItem(productId: string, quantity: number) {
  return apiPost('/cart/add', { productId, quantity });
}

export async function updateCartItem(productId: string, quantity: number) {
  return apiPost('/cart/update', { productId, quantity });
}

export async function removeCartItem(productId: string) {
  return apiPost('/cart/remove', { productId });
}
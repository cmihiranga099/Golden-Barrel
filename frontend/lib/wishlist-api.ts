import { apiGet, apiPost } from './api';

export async function fetchWishlist() {
  return apiGet('/wishlist');
}

export async function addWishlistItem(productId: string) {
  return apiPost('/wishlist/add', { productId });
}

export async function removeWishlistItem(productId: string) {
  return apiPost('/wishlist/remove', { productId });
}
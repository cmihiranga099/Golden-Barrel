import { apiGet, apiPost } from './api';

export type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: { name?: string };
};

export async function listReviews(productId: string) {
  return apiGet<Review[]>(`/reviews?productId=${productId}`);
}

export async function createReview(productId: string, rating: number, comment: string) {
  return apiPost('/reviews', { productId, rating, comment });
}

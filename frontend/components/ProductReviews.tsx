'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../lib/api';
import { useToast } from './ui/ToastProvider';
import { getTokens } from '../lib/auth';

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: { name?: string };
};

export function ProductReviews({ productId }: { productId: string }) {
  const { push } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const load = async () => {
    const data = await apiGet<Review[]>(`/reviews?productId=${productId}`);
    setReviews(data || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, [productId]);

  const submit = async () => {
    if (!getTokens()?.accessToken) {
      push('Please sign in to leave a review.');
      return;
    }
    if (!comment.trim()) {
      push('Please add a comment.');
      return;
    }
    await apiPost('/reviews', { productId, rating, comment });
    setComment('');
    setRating(5);
    push('Review submitted.');
    await load();
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="display text-xl text-gold-200">Reviews</h2>
      <div className="mt-4 space-y-3 text-sm">
        {reviews.length === 0 && <p className="text-[#6f6256]">No reviews yet.</p>}
        {reviews.map((review) => (
          <div key={review._id} className="rounded-xl border border-black/10 p-3">
            <div className="flex items-center justify-between text-xs text-[#6f6256]">
              <span>{review.userId?.name || 'Customer'}</span>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-gold-200">Rating: {review.rating}/5</p>
            <p className="mt-2 text-[#4f4338]">{review.comment}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-xs text-[#6f6256]">
          <span>Rating</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded-md bg-white/70 p-2 text-xs"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-md bg-white/70 p-3 text-sm"
          rows={3}
          placeholder="Share your tasting notes..."
        />
        <button
          onClick={submit}
          className="rounded-full border border-gold-400 px-4 py-2 text-xs text-gold-200"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}

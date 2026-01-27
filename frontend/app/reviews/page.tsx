const reviews = [
  {
    name: 'Ava R.',
    title: 'Whisky Collector',
    quote:
      'Golden Barrel has the best curated whisky list I have seen. Every bottle arrived perfectly packaged.',
  },
  {
    name: 'Marcus L.',
    title: 'Home Bartender',
    quote:
      'Fast delivery, great pricing, and the tasting notes are accurate. It makes choosing bottles easy.',
  },
  {
    name: 'Priya S.',
    title: 'Event Planner',
    quote:
      'Ordered for a corporate event and the experience was flawless. The team was responsive and helpful.',
  },
  {
    name: 'Daniel K.',
    title: 'Gin Enthusiast',
    quote:
      'Loved the Colombo gin selection. Smooth checkout and beautiful presentation.',
  },
  {
    name: 'Sofia M.',
    title: 'Wine Lover',
    quote:
      'The wine recommendations were spot on. I will definitely shop here again.',
  },
  {
    name: 'Jon T.',
    title: 'Craft Beer Fan',
    quote:
      'Nice variety and the filters made it easy to find exactly what I wanted.',
  },
];

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Reviews</p>
          <h1 className="display mt-4 text-4xl">Customer Stories</h1>
          <p className="mt-3 text-sm text-[#4f4338]">
            Real feedback from Golden Barrel customers. Thanks for sharing your experience.
          </p>
        </div>
        <div className="text-sm text-[#4f4338]">
          Average rating: <span className="text-gold-200">4.9</span> / 5
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.name} className="glass rounded-2xl p-6">
            <p className="text-sm text-[#4f4338]">“{review.quote}”</p>
            <div className="mt-4">
              <p className="text-sm font-semibold text-gold-200">{review.name}</p>
              <p className="text-xs text-[#6f6256]">{review.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

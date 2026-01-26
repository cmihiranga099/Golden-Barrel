'use client';

const timeline = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="display text-3xl">Order {params.id}</h1>
      <div className="mt-6 glass rounded-2xl p-6">
        <h2 className="display text-xl text-gold-200">Status Timeline</h2>
        <div className="mt-4 space-y-3">
          {timeline.map((step, idx) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <div className={`h-2 w-2 rounded-full ${idx < 3 ? 'bg-gold-400' : 'bg-white/10'}`} />
              <span className={idx < 3 ? 'text-gold-200' : 'text-[#8c8378]'}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
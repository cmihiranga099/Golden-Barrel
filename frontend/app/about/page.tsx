export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
      <div className="rounded-3xl border border-gold-400/20 bg-gradient-to-br from-[#fff8eb] via-white to-[#f7efe3] p-6 shadow-sm sm:p-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">About Us</p>
            <h1 className="display mt-4 text-3xl sm:text-4xl">Golden Barrel</h1>
            <p className="mt-4 text-sm text-[#4f4338]">
              Golden Barrel is a modern spirits boutique built for collectors and casual sippers alike.
              We curate premium whisky, gin, vodka, wine, champagne, and beer with a focus on quality,
              authenticity, and responsible enjoyment.
            </p>
            <p className="mt-4 text-sm text-[#4f4338]">
              From small-batch releases to global icons, our catalog is designed to help you discover
              new favorites and celebrate the craft behind every bottle.
            </p>
            <p className="mt-4 text-sm text-[#4f4338]">
              Our team tastes, tests, and curates each selection with a simple goal: make it easy to
              find bottles worth celebrating. Whether you are building a home bar or gifting a standout
              expression, Golden Barrel delivers with care.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-gold-400/40 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200">
                Curated Selection
              </span>
              <span className="rounded-full border border-gold-400/40 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200">
                Responsible Retail
              </span>
              <span className="rounded-full border border-gold-400/40 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200">
                Premium Service
              </span>
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Our Promise</p>
                <p className="mt-2 text-sm text-[#4f4338]">
                  Verified products, fair pricing, and fast, secure delivery.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Responsible Retail</p>
                <p className="mt-2 text-sm text-[#4f4338]">
                  We only sell to customers of legal drinking age. Please enjoy responsibly.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Support</p>
                <p className="mt-2 text-sm text-[#4f4338]">
                  Have questions? Reach us at support@goldenbarrel.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        <div className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Our Story</p>
          <p className="mt-3 text-sm text-[#4f4338]">
            Founded by collectors and bartenders, Golden Barrel blends boutique curation with a
            seamless online experience. We spotlight heritage brands and rising distilleries alike.
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">What We Carry</p>
          <p className="mt-3 text-sm text-[#4f4338]">
            Whisky, gin, vodka, wine, champagne, and beer. We prioritize authenticity, provenance,
            and tasting notes you can trust.
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Quality & Care</p>
          <p className="mt-3 text-sm text-[#4f4338]">
            Temperature-aware storage, secure packaging, and fast delivery keep every bottle in
            pristine condition.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Visit & Delivery</p>
          <p className="mt-3 text-sm text-[#4f4338]">
            Order online for fast local delivery or schedule curated gifting. We provide order
            tracking and responsive customer support.
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Community</p>
          <p className="mt-3 text-sm text-[#4f4338]">
            We partner with tasting rooms, host seasonal releases, and support responsible drinking
            education in the community.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-4">
        {[
          { label: 'Curated Bottles', value: '120+' },
          { label: 'Premium Brands', value: '40+' },
          { label: 'Happy Customers', value: '10k+' },
          { label: 'Avg Rating', value: '4.9' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-6 text-center">
            <p className="text-3xl font-semibold text-gold-200">{stat.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#6f6256]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

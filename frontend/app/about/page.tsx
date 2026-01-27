export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">About Us</p>
          <h1 className="display mt-4 text-4xl">Golden Barrel</h1>
          <p className="mt-4 text-sm text-[#4f4338]">
            Golden Barrel is a modern spirits boutique built for collectors and casual sippers alike.
            We curate premium whisky, gin, vodka, wine, champagne, and beer with a focus on quality,
            authenticity, and responsible enjoyment.
          </p>
          <p className="mt-4 text-sm text-[#4f4338]">
            From small-batch releases to global icons, our catalog is designed to help you discover
            new favorites and celebrate the craft behind every bottle.
          </p>
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
  );
}

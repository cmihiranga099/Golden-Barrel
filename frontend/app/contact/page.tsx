export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Contact Us</p>
          <h1 className="display mt-4 text-4xl">We’re here to help</h1>
          <p className="mt-4 text-sm text-[#4f4338]">
            Questions about an order, product availability, or gifting? Reach out and our team will
            respond quickly.
          </p>
          <div className="mt-6 space-y-3 text-sm text-[#4f4338]">
            <p>support@goldenbarrel.com</p>
            <p>+1 (555) 214-9982</p>
            <p>Mon–Fri · 9:00 AM – 7:00 PM</p>
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <form className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Name</label>
              <input
                className="mt-2 w-full rounded-md border border-black/10 bg-white/70 p-3 text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Email</label>
              <input
                type="email"
                className="mt-2 w-full rounded-md border border-black/10 bg-white/70 p-3 text-sm"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-[#6f6256]">Message</label>
              <textarea
                rows={4}
                className="mt-2 w-full rounded-md border border-black/10 bg-white/70 p-3 text-sm"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-full border border-gold-400 px-4 py-3 text-sm font-semibold text-gold-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

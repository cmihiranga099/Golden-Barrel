export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
        <div>
          <h3 className="display text-xl text-gold-200">Golden Barrel</h3>
          <p className="mt-3 text-sm text-[#cfc7bc]">
            Premium spirits curated for discerning palates. Enjoy responsibly.
          </p>
        </div>
        <div className="text-sm text-[#cfc7bc]">
          <p>Policies</p>
          <p className="mt-2">Shipping & Returns</p>
          <p className="mt-2">Privacy Policy</p>
          <p className="mt-2">Terms of Service</p>
        </div>
        <div className="text-sm text-[#cfc7bc]">
          <p>Contact</p>
          <p className="mt-2">support@goldenbarrel.com</p>
          <p className="mt-2">+1 (555) 214-9982</p>
          <p className="mt-2">21+ only. Please drink responsibly.</p>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-[#8c8378]">
        Golden Barrel sells alcoholic beverages. You must be of legal drinking age to purchase.
      </div>
    </footer>
  );
}
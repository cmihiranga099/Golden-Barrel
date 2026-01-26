import { AdminGuard } from '../../../components/admin/AdminGuard';

export default function AdminCouponsPage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="display text-3xl">Coupons & Discounts</h1>
        <p className="mt-4 text-sm text-[#8c8378]">Create and manage promo codes.</p>
        <div className="mt-6 glass rounded-2xl p-6">Coupons table placeholder.</div>
      </div>
    </AdminGuard>
  );
}
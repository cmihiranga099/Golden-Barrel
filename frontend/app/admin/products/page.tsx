'use client';

import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost } from '../../../lib/api';
import { AdminGuard } from '../../../components/admin/AdminGuard';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [draft, setDraft] = useState({
    name: '',
    slug: '',
    categoryId: '',
    brandId: '',
    price: 0,
    stock: 0,
    abv: 40,
    volume: 750,
    images: ['https://unsplash.com/photos/LVotgZ43LLU/download?auto=format&fit=crop&w=800&q=80'],
  });
  const [categoryName, setCategoryName] = useState('');
  const [brandName, setBrandName] = useState('');

  const load = async () => {
    const [p, c, b] = await Promise.all([
      apiGet<any[]>('/products'),
      apiGet<any[]>('/categories'),
      apiGet<any[]>('/brands'),
    ]);
    setProducts(p || []);
    setCategories(c || []);
    setBrands(b || []);
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  return (
    <AdminGuard>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="display text-3xl">Products Management</h1>
        <p className="mt-4 text-sm text-[#8c8378]">Create, edit, and manage inventory.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="display text-xl text-gold-200">Create Product</h2>
            <div className="mt-4 grid gap-3">
              <input className="rounded-md bg-black/40 p-3 text-sm" placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <input className="rounded-md bg-black/40 p-3 text-sm" placeholder="Slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
              <div className="grid gap-3 md:grid-cols-2">
                <select className="rounded-md bg-black/40 p-3 text-sm" value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
                  <option value="">Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <select className="rounded-md bg-black/40 p-3 text-sm" value={draft.brandId} onChange={(e) => setDraft({ ...draft, brandId: e.target.value })}>
                  <option value="">Brand</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input type="number" className="rounded-md bg-black/40 p-3 text-sm" placeholder="Price" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
                <input type="number" className="rounded-md bg-black/40 p-3 text-sm" placeholder="Stock" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input type="number" className="rounded-md bg-black/40 p-3 text-sm" placeholder="ABV" value={draft.abv} onChange={(e) => setDraft({ ...draft, abv: Number(e.target.value) })} />
                <input type="number" className="rounded-md bg-black/40 p-3 text-sm" placeholder="Volume (ml)" value={draft.volume} onChange={(e) => setDraft({ ...draft, volume: Number(e.target.value) })} />
              </div>
              <button
                className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
                onClick={async () => {
                  await apiPost('/products', draft);
                  await load();
                }}
              >
                Create
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="display text-xl text-gold-200">Categories and Brands</h2>
            <div className="mt-4 grid gap-3">
              <div className="flex gap-2">
                <input className="w-full rounded-md bg-black/40 p-3 text-sm" placeholder="New category" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                <button
                  className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
                  onClick={async () => {
                    await apiPost('/categories', { name: categoryName, slug: categoryName.toLowerCase().replace(/\s+/g, '-') });
                    setCategoryName('');
                    await load();
                  }}
                >
                  Add
                </button>
              </div>
              <div className="flex gap-2">
                <input className="w-full rounded-md bg-black/40 p-3 text-sm" placeholder="New brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                <button
                  className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
                  onClick={async () => {
                    await apiPost('/brands', { name: brandName, slug: brandName.toLowerCase().replace(/\s+/g, '-') });
                    setBrandName('');
                    await load();
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 glass rounded-2xl p-6">
          <h2 className="display text-xl text-gold-200">Inventory</h2>
          <div className="mt-4 space-y-3 text-sm">
            {products.map((product) => (
              <div key={product._id} className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <p className="text-gold-200">{product.name}</p>
                  <p className="text-xs text-[#8c8378]">${product.price} | Stock {product.stock}</p>
                </div>
                <button
                  className="text-xs text-[#8c8378]"
                  onClick={async () => {
                    await apiDelete(`/products/${product._id}`);
                    await load();
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

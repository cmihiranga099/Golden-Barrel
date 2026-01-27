'use client';

import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPut } from '../../../lib/api';
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
    discountPrice: 0,
    stock: 0,
    abv: 40,
    volume: 750,
    images: [''],
    description: '',
    tags: [''],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [categoryEdit, setCategoryEdit] = useState({ name: '', slug: '' });
  const [brandEdit, setBrandEdit] = useState({ name: '', slug: '' });

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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6256]">Catalog</p>
            <h1 className="display mt-2 text-3xl">Products Management</h1>
            <p className="mt-2 text-sm text-[#6f6256]">Create, edit, and manage inventory.</p>
          </div>
          <button
            className="rounded-full border border-gold-400 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-200"
            onClick={load}
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="display text-xl text-gold-200">
              {editingId ? 'Edit Product' : 'Create Product'}
            </h2>
            <div className="mt-4 grid gap-3">
              <input className="rounded-md bg-white/70 p-3 text-sm" placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <input className="rounded-md bg-white/70 p-3 text-sm" placeholder="Slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
              <div className="grid gap-3 md:grid-cols-2">
                <select className="rounded-md bg-white/70 p-3 text-sm" value={draft.categoryId} onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}>
                  <option value="">Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <select className="rounded-md bg-white/70 p-3 text-sm" value={draft.brandId} onChange={(e) => setDraft({ ...draft, brandId: e.target.value })}>
                  <option value="">Brand</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input type="number" className="rounded-md bg-white/70 p-3 text-sm" placeholder="Price" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
                <input type="number" className="rounded-md bg-white/70 p-3 text-sm" placeholder="Discount Price" value={draft.discountPrice || ''} onChange={(e) => setDraft({ ...draft, discountPrice: Number(e.target.value) })} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input type="number" className="rounded-md bg-white/70 p-3 text-sm" placeholder="Stock" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} />
                <input type="number" className="rounded-md bg-white/70 p-3 text-sm" placeholder="ABV" value={draft.abv} onChange={(e) => setDraft({ ...draft, abv: Number(e.target.value) })} />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input type="number" className="rounded-md bg-white/70 p-3 text-sm" placeholder="Volume (ml)" value={draft.volume} onChange={(e) => setDraft({ ...draft, volume: Number(e.target.value) })} />
              </div>
              <input
                className="rounded-md bg-white/70 p-3 text-sm"
                placeholder="Images (comma separated URLs or /public paths)"
                value={draft.images.join(', ')}
                onChange={(e) => setDraft({ ...draft, images: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
              />
              <input
                className="rounded-md bg-white/70 p-3 text-sm"
                placeholder="Tags (comma separated)"
                value={draft.tags.join(', ')}
                onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })}
              />
              <textarea
                className="rounded-md bg-white/70 p-3 text-sm"
                placeholder="Description"
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
              <button
                className="rounded-full border border-gold-400 px-4 py-2 text-sm text-gold-200"
                onClick={async () => {
                  const payload = {
                    ...draft,
                    discountPrice: draft.discountPrice || undefined,
                    images: draft.images.filter(Boolean),
                    tags: draft.tags.filter(Boolean),
                  };
                  if (editingId) {
                    await apiPut(`/products/${editingId}`, payload);
                  } else {
                    await apiPost('/products', payload);
                  }
                  setEditingId(null);
                  setDraft({
                    name: '',
                    slug: '',
                    categoryId: '',
                    brandId: '',
                    price: 0,
                    discountPrice: 0,
                    stock: 0,
                    abv: 40,
                    volume: 750,
                    images: [''],
                    description: '',
                    tags: [''],
                  });
                  await load();
                }}
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  className="rounded-full border border-black/10 px-4 py-2 text-sm text-[#6f6256]"
                  onClick={() => {
                    setEditingId(null);
                    setDraft({
                      name: '',
                      slug: '',
                      categoryId: '',
                      brandId: '',
                      price: 0,
                      discountPrice: 0,
                      stock: 0,
                      abv: 40,
                      volume: 750,
                      images: [''],
                      description: '',
                      tags: [''],
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 shadow-sm">
            <h2 className="display text-xl text-gold-200">Categories and Brands</h2>
            <div className="mt-4 grid gap-3">
              <div className="flex gap-2">
                <input className="w-full rounded-md bg-white/70 p-3 text-sm" placeholder="New category" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
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
                <input className="w-full rounded-md bg-white/70 p-3 text-sm" placeholder="New brand" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
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

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-[#4f4338]">Categories</h3>
                <div className="mt-3 space-y-2 text-xs">
                  {categories.map((cat) => (
                    <div key={cat._id} className="flex items-center justify-between border-b border-black/10 pb-2">
                      {editingCategoryId === cat._id ? (
                        <div className="flex w-full items-center gap-2">
                          <input
                            className="w-full rounded-md bg-white/70 p-2"
                            placeholder="Name"
                            value={categoryEdit.name}
                            onChange={(e) => setCategoryEdit({ ...categoryEdit, name: e.target.value })}
                          />
                          <input
                            className="w-full rounded-md bg-white/70 p-2"
                            placeholder="Slug"
                            value={categoryEdit.slug}
                            onChange={(e) => setCategoryEdit({ ...categoryEdit, slug: e.target.value })}
                          />
                          <button
                            className="rounded-full border border-gold-400 px-3 py-1 text-xs text-gold-200"
                            onClick={async () => {
                              await apiPut(`/categories/${cat._id}`, categoryEdit);
                              setEditingCategoryId(null);
                              await load();
                            }}
                          >
                            Save
                          </button>
                          <button
                            className="text-xs text-[#6f6256]"
                            onClick={() => setEditingCategoryId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="text-[#4f4338]">{cat.name}</p>
                            <p className="text-[#6f6256]">{cat.slug}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-full border border-gold-400 px-3 py-1 text-xs text-gold-200"
                              onClick={() => {
                                setEditingCategoryId(cat._id);
                                setCategoryEdit({ name: cat.name, slug: cat.slug });
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-xs text-[#6f6256]"
                              onClick={async () => {
                                await apiDelete(`/categories/${cat._id}`);
                                await load();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#4f4338]">Brands</h3>
                <div className="mt-3 space-y-2 text-xs">
                  {brands.map((brand) => (
                    <div key={brand._id} className="flex items-center justify-between border-b border-black/10 pb-2">
                      {editingBrandId === brand._id ? (
                        <div className="flex w-full items-center gap-2">
                          <input
                            className="w-full rounded-md bg-white/70 p-2"
                            placeholder="Name"
                            value={brandEdit.name}
                            onChange={(e) => setBrandEdit({ ...brandEdit, name: e.target.value })}
                          />
                          <input
                            className="w-full rounded-md bg-white/70 p-2"
                            placeholder="Slug"
                            value={brandEdit.slug}
                            onChange={(e) => setBrandEdit({ ...brandEdit, slug: e.target.value })}
                          />
                          <button
                            className="rounded-full border border-gold-400 px-3 py-1 text-xs text-gold-200"
                            onClick={async () => {
                              await apiPut(`/brands/${brand._id}`, brandEdit);
                              setEditingBrandId(null);
                              await load();
                            }}
                          >
                            Save
                          </button>
                          <button
                            className="text-xs text-[#6f6256]"
                            onClick={() => setEditingBrandId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="text-[#4f4338]">{brand.name}</p>
                            <p className="text-[#6f6256]">{brand.slug}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-full border border-gold-400 px-3 py-1 text-xs text-gold-200"
                              onClick={() => {
                                setEditingBrandId(brand._id);
                                setBrandEdit({ name: brand.name, slug: brand.slug });
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-xs text-[#6f6256]"
                              onClick={async () => {
                                await apiDelete(`/brands/${brand._id}`);
                                await load();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 glass rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="display text-xl text-gold-200">Inventory</h2>
            <span className="text-xs text-[#6f6256]">{products.length} items</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
            <div className="grid grid-cols-[2fr,1fr,1fr,auto] bg-white/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6f6256]">
              <span>Product</span>
              <span>Price</span>
              <span>Stock</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-black/10 text-sm">
              {products.map((product) => (
                <div key={product._id} className="grid grid-cols-[2fr,1fr,1fr,auto] items-center px-4 py-3">
                  <div>
                    <p className="text-gold-200">{product.name}</p>
                    <p className="text-xs text-[#6f6256]">{product.slug}</p>
                  </div>
                  <span className="text-[#4f4338]">${product.price}</span>
                  <span className="text-[#4f4338]">{product.stock}</span>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="rounded-full border border-gold-400 px-3 py-1 text-xs text-gold-200"
                      onClick={() => {
                        setEditingId(product._id);
                        setDraft({
                          name: product.name || '',
                          slug: product.slug || '',
                          categoryId: product.categoryId?._id || product.categoryId || '',
                          brandId: product.brandId?._id || product.brandId || '',
                          price: Number(product.price || 0),
                          discountPrice: Number(product.discountPrice || 0),
                          stock: Number(product.stock || 0),
                          abv: Number(product.abv || 0),
                          volume: Number(product.volume || 0),
                          images: product.images?.length ? product.images : [''],
                          description: product.description || '',
                          tags: product.tags?.length ? product.tags : [''],
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-[#6f6256]"
                      onClick={async () => {
                        await apiDelete(`/products/${product._id}`);
                        await load();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="px-4 py-4 text-xs text-[#6f6256]">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

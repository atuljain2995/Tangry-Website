'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminLink } from '@/components/admin/AdminLink';
import { ProductCategorySelect } from '@/components/admin/ProductCategorySelect';
import { KeywordChipsInput } from '@/components/admin/KeywordChipsInput';
import { createProduct } from '@/lib/actions/admin-products';
import type { DbProductCategory } from '@/lib/db/queries';

export function AdminNewProductForm({ categories }: { categories: DbProductCategory[] }) {
  const router = useRouter();
  const [isNavPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isHeroProduct, setIsHeroProduct] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [variantName, setVariantName] = useState('Default');
  const [variantSku, setVariantSku] = useState('');
  const [variantPrice, setVariantPrice] = useState('');
  const [variantCompareAtPrice, setVariantCompareAtPrice] = useState('');
  const [variantStock, setVariantStock] = useState('0');
  const [variantWeight, setVariantWeight] = useState('100');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const result = await createProduct({
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      category_id: categoryId.trim() || undefined,
      meta_title: metaTitle.trim() || undefined,
      meta_description: metaDescription.trim() || undefined,
      keywords,
      is_featured: isFeatured,
      is_new: isNew,
      is_best_seller: isBestSeller,
      is_hero_product: isHeroProduct,
      image_url: imageUrl.trim() || undefined,
      variant_name: variantName.trim() || undefined,
      variant_sku: variantSku.trim() || undefined,
      variant_price: parseFloat(variantPrice) || 0,
      variant_compare_at_price: variantCompareAtPrice
        ? parseFloat(variantCompareAtPrice)
        : undefined,
      variant_stock: parseInt(variantStock, 10) || 0,
      variant_weight: parseInt(variantWeight, 10) || 100,
    });
    setSaving(false);
    if (result.success) {
      startTransition(() => {
        router.push(`/admin/products/${result.productId}`);
        router.refresh();
      });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 ${
            message.type === 'ok'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Product details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (optional, auto from name)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. my-spice-blend"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="new-product-category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <ProductCategorySelect
              id="new-product-category"
              categories={categories}
              value={categoryId}
              onChange={setCategoryId}
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO keywords</label>
            <KeywordChipsInput
              value={keywords}
              onChange={setKeywords}
              placeholder="Type keyword and press comma"
              disabled={saving}
            />
            <p className="mt-1 text-xs text-gray-500">Press comma to create each keyword chip.</p>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">New</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Best seller</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isHeroProduct}
                onChange={(e) => setIsHeroProduct(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Hero section</span>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Image</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (optional)
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/products/placeholder.png or upload later"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Default variant</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant name</label>
              <input
                type="text"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={variantSku}
                onChange={(e) => setVariantSku(e.target.value)}
                placeholder="e.g. TANGRY-GM-50"
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={variantPrice}
                onChange={(e) => setVariantPrice(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare at price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={variantCompareAtPrice}
                onChange={(e) => setVariantCompareAtPrice(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={variantStock}
                onChange={(e) => setVariantStock(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
              <input
                type="number"
                min="0"
                value={variantWeight}
                onChange={(e) => setVariantWeight(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || isNavPending}
          className="inline-flex items-center justify-center gap-2 rounded bg-orange-600 px-4 py-2 text-white font-medium hover:bg-orange-700 disabled:opacity-50"
        >
          {(saving || isNavPending) && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          )}
          {saving ? 'Creating…' : isNavPending ? 'Opening editor…' : 'Create product'}
        </button>
        <AdminLink
          href="/admin/products"
          className={`rounded border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 ${saving || isNavPending ? 'pointer-events-none opacity-50' : ''}`}
          onClick={(e) => {
            if (saving || isNavPending) e.preventDefault();
          }}
        >
          Cancel
        </AdminLink>
      </div>
    </form>
  );
}

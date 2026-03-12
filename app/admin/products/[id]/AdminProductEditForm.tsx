'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { updateProduct, updateProductImages } from '@/lib/actions/admin-products';
import type { ProductForAdmin } from '@/lib/db/queries';

export function AdminProductEditForm({ data }: { data: ProductForAdmin }) {
  const { product, images: initialImages } = data;
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? '');
  const [category, setCategory] = useState(product.category ?? '');
  const [subcategory, setSubcategory] = useState(product.subcategory ?? '');
  const [metaTitle, setMetaTitle] = useState(product.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(product.meta_description ?? '');
  const [isFeatured, setIsFeatured] = useState(product.is_featured ?? false);
  const [isNew, setIsNew] = useState(product.is_new ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product.is_best_seller ?? false);
  const [imageRows, setImageRows] = useState(
    initialImages.length > 0
      ? initialImages.map((img) => ({ id: img.id, url: img.url, alt_text: img.alt_text ?? '' }))
      : [{ id: undefined as string | undefined, url: '', alt_text: '' }]
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const addImageRow = useCallback(() => {
    setImageRows((prev) => [...prev, { id: undefined, url: '', alt_text: '' }]);
  }, []);

  const removeImageRow = useCallback((index: number) => {
    setImageRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setImageRow = useCallback((index: number, field: 'url' | 'alt_text', value: string) => {
    setImageRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setMessage(null);
      const productResult = await updateProduct(product.id, {
        name,
        description: description || null,
        category: category || null,
        subcategory: subcategory || null,
        meta_title: metaTitle || product.name,
        meta_description: metaDescription || description || '',
        is_featured: isFeatured,
        is_new: isNew,
        is_best_seller: isBestSeller,
      });
      if (!productResult.success) {
        setMessage({ type: 'error', text: productResult.error });
        setSaving(false);
        return;
      }
      const imagesPayload = imageRows
        .filter((row) => row.url.trim() !== '')
        .map((row) => ({
          id: row.id,
          url: row.url.trim(),
          alt_text: row.alt_text || null,
        }));
      const imageResult = await updateProductImages(
        product.id,
        imagesPayload.length > 0 ? imagesPayload : [{ url: '/products/placeholder.png', alt_text: 'Placeholder' }]
      );
      if (!imageResult.success) {
        setMessage({ type: 'error', text: imageResult.error });
        setSaving(false);
        return;
      }
      setMessage({ type: 'ok', text: 'Saved.' });
      setSaving(false);
    },
    [
      product.id,
      product.name,
      product.slug,
      name,
      description,
      category,
      subcategory,
      metaTitle,
      metaDescription,
      isFeatured,
      isNew,
      isBestSeller,
      imageRows,
    ]
  );

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/products" className="text-sm text-gray-600 hover:text-orange-600">
          ← Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit: {product.name}</h1>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 ${
            message.type === 'ok' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
                required
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  placeholder="e.g. Blended Spices"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
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
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Images</h2>
          <p className="text-sm text-gray-500 mb-4">
            Use <code className="bg-gray-100 px-1 rounded">/products/filename.jpg</code> for files in{' '}
            <code className="bg-gray-100 px-1 rounded">public/products/</code>, or a full URL.
          </p>
          <div className="space-y-4">
            {imageRows.map((row, index) => (
              <div key={row.id ?? index} className="flex gap-3 items-start">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={row.url}
                    onChange={(e) => setImageRow(index, 'url', e.target.value)}
                    placeholder="URL e.g. /products/garam-masala.jpg"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={row.alt_text}
                    onChange={(e) => setImageRow(index, 'alt_text', e.target.value)}
                    placeholder="Alt text (optional)"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                {row.url && (
                  <div className="w-16 h-16 flex-shrink-0 rounded border overflow-hidden bg-gray-100">
                    <img
                      src={row.url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/products/placeholder.png';
                      }}
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImageRow(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageRow}
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              + Add image
            </button>
          </div>
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-orange-600 px-4 py-2 text-white font-medium hover:bg-orange-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save product'}
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
          >
            View on store
          </Link>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useCallback, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import { AdminLink } from '@/components/admin/AdminLink';
import { ProductCategorySelect } from '@/components/admin/ProductCategorySelect';
import { updateProduct, updateProductImages, upsertProductVariants, type VariantInput } from '@/lib/actions/admin-products';
import type { DbProductCategory, ProductForAdmin } from '@/lib/db/queries';

type VariantRow = VariantInput & { _key?: string };

export function AdminProductEditForm({
  data,
  categories,
}: {
  data: ProductForAdmin;
  categories: DbProductCategory[];
}) {
  const { product, images: initialImages, variants: initialVariants } = data;
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? '');
  const [categoryId, setCategoryId] = useState(product.category_id ?? '');
  const [metaTitle, setMetaTitle] = useState(product.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(product.meta_description ?? '');
  const [isFeatured, setIsFeatured] = useState(product.is_featured ?? false);
  const [isNew, setIsNew] = useState(product.is_new ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product.is_best_seller ?? false);
  const [isHeroProduct, setIsHeroProduct] = useState(product.is_hero_product ?? false);
  const [variantRows, setVariantRows] = useState<VariantRow[]>(
    initialVariants.length > 0
      ? initialVariants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          compare_at_price: v.compare_at_price ?? undefined,
          stock: v.stock,
          weight: v.weight,
          is_available: v.is_available,
        }))
      : [{ name: 'Default', sku: '', price: 0, compare_at_price: undefined, stock: 0, weight: 100, is_available: true }]
  );
  const [imageRows, setImageRows] = useState(
    initialImages.length > 0
      ? initialImages.map((img) => ({ id: img.id, url: img.url, alt_text: img.alt_text ?? '', previewKey: undefined as number | undefined }))
      : [{ id: undefined as string | undefined, url: '', alt_text: '', previewKey: undefined as number | undefined }]
  );
  const [saving, setSaving] = useState(false);
  const saveInFlightRef = useRef(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [uploadingRow, setUploadingRow] = useState<number | null>(null);

  const setVariantRow = useCallback((index: number, field: keyof VariantRow, value: string | number | boolean | undefined) => {
    setVariantRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addVariantRow = useCallback(() => {
    setVariantRows((prev) => [...prev, { name: '', sku: '', price: 0, compare_at_price: undefined, stock: 0, weight: 100, is_available: true }]);
  }, []);

  const removeVariantRow = useCallback((index: number) => {
    setVariantRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addImageRow = useCallback(() => {
    setImageRows((prev) => [...prev, { id: undefined, url: '', alt_text: '', previewKey: undefined }]);
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

  const handleFileChange = useCallback(
    async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image (JPEG, PNG, WebP, GIF).' });
        return;
      }
      setUploadingRow(index);
      setMessage(null);
      try {
        const formData = new FormData();
        formData.set('file', file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessage({ type: 'error', text: (data?.error as string) || 'Upload failed' });
          return;
        }
        if (data.url) {
          setImageRows((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], url: data.url, previewKey: Date.now() };
            return next;
          });
        }
      } catch {
        setMessage({ type: 'error', text: 'Upload failed' });
      } finally {
        setUploadingRow(null);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (saveInFlightRef.current) return;
      saveInFlightRef.current = true;
      setSaving(true);
      setMessage(null);
      try {
        const productResult = await updateProduct(product.id, {
          name,
          description: description || null,
          category_id: categoryId.trim() || null,
          meta_title: metaTitle || product.name,
          meta_description: metaDescription || description || '',
          is_featured: isFeatured,
          is_new: isNew,
          is_best_seller: isBestSeller,
          is_hero_product: isHeroProduct,
        });
        if (!productResult.success) {
          setMessage({ type: 'error', text: productResult.error });
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
          imagesPayload.length > 0 ? imagesPayload : [{ url: '/images/logo-512.png', alt_text: 'Placeholder' }]
        );
        if (!imageResult.success) {
          setMessage({ type: 'error', text: imageResult.error });
          return;
        }
        const variantsPayload: VariantInput[] = variantRows.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: Number(v.price) || 0,
          compare_at_price: v.compare_at_price ?? null,
          stock: Number(v.stock) ?? 0,
          weight: Number(v.weight) ?? 100,
          is_available: !!v.is_available,
        }));
        if (variantsPayload.length > 0) {
          const variantResult = await upsertProductVariants(product.id, variantsPayload);
          if (!variantResult.success) {
            setMessage({ type: 'error', text: variantResult.error });
            return;
          }
        }
        setMessage({ type: 'ok', text: 'Saved.' });
      } finally {
        saveInFlightRef.current = false;
        setSaving(false);
      }
    },
    [
      product.id,
      product.name,
      name,
      description,
      categoryId,
      metaTitle,
      metaDescription,
      isFeatured,
      isNew,
      isBestSeller,
      isHeroProduct,
      imageRows,
      variantRows,
    ]
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <AdminLink
          href="/admin/products"
          aria-disabled={saving}
          onClick={(e) => {
            if (saving) e.preventDefault();
          }}
          className={`inline-flex w-fit min-h-9 shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${saving ? 'pointer-events-none opacity-50' : ''}`}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back
        </AdminLink>
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

      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-2xl"
        aria-busy={saving}
      >
        <fieldset
          disabled={saving}
          className="min-w-0 space-y-8 border-0 p-0 m-0 disabled:cursor-wait disabled:opacity-65"
        >
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
            <div>
              <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <ProductCategorySelect
                id="product-category"
                categories={categories}
                value={categoryId}
                onChange={setCategoryId}
                disabled={saving}
                legacyCategoryTitle={
                  !product.category_id && product.category ? product.category : null
                }
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

        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Images</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload an image (JPEG, PNG, WebP, GIF, max 5MB) or paste a URL. First image is used as the main product image.
          </p>
          <div className="space-y-5">
            {imageRows.map((row, index) => (
              <div
                key={row.id ?? index}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:flex-row sm:items-start"
              >
                {/* Preview + actions */}
                <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row sm:items-start">
                  <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-inner">
                    {row.url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          key={row.previewKey ?? row.url}
                          src={row.url + (row.previewKey ? `?t=${row.previewKey}` : '')}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/logo-512.png';
                          }}
                        />
                        {uploadingRow === index && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-sm font-medium text-white">Uploading…</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ImagePlus className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex min-h-[44px] flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
                    <input
                      id={`product-image-file-${index}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={(e) => handleFileChange(index, e)}
                      disabled={uploadingRow !== null}
                    />
                    <label
                      htmlFor={`product-image-file-${index}`}
                      className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-100 disabled:pointer-events-none disabled:opacity-50 ${
                        uploadingRow === index ? 'opacity-70' : ''
                      }`}
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingRow === index ? 'Uploading…' : row.url ? 'Replace' : 'Upload'}
                    </label>
                    <button
                      type="button"
                      onClick={() => removeImageRow(index)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
                {/* URL + alt */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-0.5">Image URL</label>
                    <input
                      type="text"
                      value={row.url}
                      onChange={(e) => setImageRow(index, 'url', e.target.value)}
                      placeholder="/products/filename.jpg"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-0.5">Alt text (for accessibility)</label>
                    <input
                      type="text"
                      value={row.alt_text}
                      onChange={(e) => setImageRow(index, 'alt_text', e.target.value)}
                      placeholder="e.g. Garam Masala packet"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageRow}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-700"
            >
              <ImagePlus className="h-4 w-4" />
              Add another image
            </button>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Variants</h2>
          <p className="text-sm text-gray-500 mb-4">Price, SKU, stock, and weight per variant.</p>
          <div className="space-y-4">
            {variantRows.map((row, index) => (
              <div key={row.id ?? index} className="rounded border border-gray-200 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Name</label>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => setVariantRow(index, 'name', e.target.value)}
                      className="mt-0.5 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                      placeholder="e.g. 50g"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">SKU</label>
                    <input
                      type="text"
                      value={row.sku}
                      onChange={(e) => setVariantRow(index, 'sku', e.target.value)}
                      className="mt-0.5 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={row.price ?? ''}
                      onChange={(e) => setVariantRow(index, 'price', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                      className="mt-0.5 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Compare at (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={row.compare_at_price ?? ''}
                      onChange={(e) => setVariantRow(index, 'compare_at_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="mt-0.5 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={row.stock}
                      onChange={(e) => setVariantRow(index, 'stock', parseInt(e.target.value, 10) || 0)}
                      className="mt-0.5 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Weight (g)</label>
                    <input
                      type="number"
                      min="0"
                      value={row.weight}
                      onChange={(e) => setVariantRow(index, 'weight', parseInt(e.target.value, 10) || 100)}
                      className="mt-0.5 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={row.is_available}
                      onChange={(e) => setVariantRow(index, 'is_available', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Available for sale
                  </label>
                  <button
                    type="button"
                    onClick={() => removeVariantRow(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariantRow}
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              + Add variant
            </button>
          </div>
        </section>
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-stretch">
            <AdminLink
              href="/admin/products"
              aria-disabled={saving}
              onClick={(e) => {
                if (saving) e.preventDefault();
              }}
              className={`inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto sm:min-w-[7.5rem] ${saving ? 'pointer-events-none opacity-50' : ''}`}
            >
              Cancel
            </AdminLink>
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={saving}
              onClick={(e) => {
                if (saving) e.preventDefault();
              }}
              className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50/60 px-4 py-2.5 text-sm font-semibold text-orange-900 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:w-auto ${saving ? 'pointer-events-none opacity-50' : ''}`}
            >
              View on store
              <ExternalLink className="h-4 w-4 shrink-0 text-orange-700" aria-hidden />
            </Link>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[9.5rem]"
          >
            {saving ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden /> : null}
            {saving ? 'Saving…' : 'Save product'}
          </button>
        </div>
      </form>
    </div>
  );
}

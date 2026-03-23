'use client';

import type { DbProductCategory } from '@/lib/db/queries';

type ProductCategorySelectProps = {
  id?: string;
  categories: DbProductCategory[];
  value: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
  required?: boolean;
  /** Shown when product has a category title in DB but no category_id (pre-migration or mismatch) */
  legacyCategoryTitle?: string | null;
};

export function ProductCategorySelect({
  id,
  categories,
  value,
  onChange,
  disabled,
  required,
  legacyCategoryTitle,
}: ProductCategorySelectProps) {
  const showLegacyHint = Boolean(legacyCategoryTitle && !value);

  return (
    <div className="space-y-1">
      {showLegacyHint && (
        <p className="text-xs font-medium text-amber-800">
          Stored label &quot;{legacyCategoryTitle}&quot; is not linked to a category. Pick one below to fix.
        </p>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 pr-9 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
      >
        {!required && <option value="">— None —</option>}
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.chip_label || c.title}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500">
        Categories are stored in the <code className="rounded bg-gray-100 px-1 font-mono text-[11px] text-gray-800">product_categories</code> table.
        Add or edit rows in Supabase (or run SQL migrations) to update the list.
      </p>
    </div>
  );
}

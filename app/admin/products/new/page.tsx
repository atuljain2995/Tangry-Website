import { AdminLink } from '@/components/admin/AdminLink';
import { getProductCategories } from '@/lib/db/queries';
import { AdminNewProductForm } from './AdminNewProductForm';

export const dynamic = 'force-dynamic';

export default async function AdminNewProductPage() {
  const categories = await getProductCategories();
  return (
    <div className="space-y-6">
      <div>
        <AdminLink href="/admin/products" className="text-sm text-gray-600 hover:text-orange-600">
          ← Products
        </AdminLink>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Add product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new product with at least one variant.
        </p>
      </div>
      <AdminNewProductForm categories={categories} />
    </div>
  );
}

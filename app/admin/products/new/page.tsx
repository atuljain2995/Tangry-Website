import Link from 'next/link';
import { AdminNewProductForm } from './AdminNewProductForm';

export const dynamic = 'force-dynamic';

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-gray-600 hover:text-orange-600">
          ← Products
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Add product</h1>
        <p className="mt-1 text-sm text-gray-500">Create a new product with at least one variant.</p>
      </div>
      <AdminNewProductForm />
    </div>
  );
}

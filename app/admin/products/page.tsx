import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllProducts } from '@/lib/db/queries';
import { AdminProductList } from './AdminProductList';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Edit product details, images, and variants. Upload images or use URLs like{' '}
            <code className="rounded bg-gray-100 px-1">/products/filename.jpg</code>.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>
      <AdminProductList products={products} />
    </div>
  );
}

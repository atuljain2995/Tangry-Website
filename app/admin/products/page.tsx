import { getAllProducts } from '@/lib/db/queries';
import { AdminProductList } from './AdminProductList';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>
      <p className="text-gray-600 mb-6">
        Edit product details and images. For image files, add them to{' '}
        <code className="bg-gray-200 px-1 rounded">public/products/</code> and use
        URL like <code className="bg-gray-200 px-1 rounded">/products/filename.jpg</code>.
      </p>
      <AdminProductList products={products} />
    </div>
  );
}

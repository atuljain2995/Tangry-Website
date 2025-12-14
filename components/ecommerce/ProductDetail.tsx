'use client';

import { useState } from 'react';
import { Star, Truck, Shield, Package, Plus, Minus, Heart, Share2 } from 'lucide-react';
import { ProductExtended } from '@/lib/types/database';
import { formatCurrency, calculateDiscountPercentage, getStockStatus, calculateSavings, estimateDeliveryDate, formatDeliveryDate } from '@/lib/utils/database';
import { useCart } from '@/lib/contexts/CartContext';
import { CartItem } from '@/lib/types/database';
import Image from 'next/image';

interface ProductDetailProps {
  product: ProductExtended;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage' | 'nutrition'>('description');
  const { addToCart } = useCart();

  // Safety check: ensure product has variants
  if (!product.variants || product.variants.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            This product doesn't have any variants configured. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const discountPercentage = calculateDiscountPercentage(selectedVariant.price, selectedVariant.compareAtPrice);
  const savings = calculateSavings(selectedVariant.price, selectedVariant.compareAtPrice);
  const stockStatus = getStockStatus(selectedVariant.stock);
  const deliveryEstimate = estimateDeliveryDate();

  const handleAddToCart = () => {
    const item: CartItem = {
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity,
      image: product.images[0] || '/placeholder-product.jpg'
    };
    addToCart(item);
  };

  const incrementQuantity = () => {
    if (quantity < selectedVariant.stock && quantity < (product.maxOrderQuantity || 100)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > product.minOrderQuantity) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.images[selectedImageIndex] ? (
              <Image 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-[#D32F2F] text-white px-4 py-2 rounded-full font-bold">
                {discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 bg-gray-100 rounded-md overflow-hidden border-2 transition ${
                    selectedImageIndex === index ? 'border-[#D32F2F]' : 'border-transparent'
                  }`}
                >
                  <Image 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Category & SKU */}
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
            {product.category} • SKU: {selectedVariant.sku}
          </p>

          {/* Product Name */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Rating & Reviews */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={20} 
                  className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Badges */}
          <div className="flex space-x-2 mb-4">
            {product.isNew && (
              <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">NEW</span>
            )}
            {product.isBestSeller && (
              <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold">BEST SELLER</span>
            )}
            {product.certifications?.map((cert, i) => (
              <span key={i} className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                {cert}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-baseline space-x-3 mb-2">
              <span className="text-4xl font-bold text-[#D32F2F]">
                {formatCurrency(selectedVariant.price * quantity)}
              </span>
              {selectedVariant.compareAtPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(selectedVariant.compareAtPrice * quantity)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-sm text-green-700 font-semibold">
                You save {formatCurrency(savings * quantity)} ({discountPercentage}%)
              </p>
            )}
            <p className="text-xs text-gray-600 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Variant Selector */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Select Size:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariantIndex(index);
                      setQuantity(1); // Reset quantity when variant changes
                    }}
                    className={`px-4 py-2 rounded-md border-2 transition ${
                      selectedVariantIndex === index
                        ? 'border-[#D32F2F] bg-[#D32F2F] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-[#D32F2F]'
                    } ${!variant.isAvailable || variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!variant.isAvailable || variant.stock === 0}
                  >
                    <span className="font-semibold">{variant.name}</span>
                    <span className="text-xs block">{formatCurrency(variant.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Quantity:</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border-2 border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                  disabled={quantity <= product.minOrderQuantity}
                >
                  <Minus size={18} />
                </button>
                <span className="px-6 py-2 font-semibold border-x-2 border-gray-300">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                  disabled={quantity >= selectedVariant.stock || quantity >= (product.maxOrderQuantity || 100)}
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className={`text-sm font-semibold ${
                stockStatus.color === 'green' ? 'text-green-600' :
                stockStatus.color === 'orange' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {stockStatus.label}
              </span>
            </div>
            {product.minOrderQuantity > 1 && (
              <p className="text-xs text-gray-600 mt-1">Minimum order: {product.minOrderQuantity} units</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant.isAvailable || selectedVariant.stock === 0}
              className="flex-1 bg-[#D32F2F] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#B71C1C] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-full hover:border-[#D32F2F] hover:text-[#D32F2F] transition">
              <Heart size={24} />
            </button>
            <button className="p-4 border-2 border-gray-300 rounded-full hover:border-[#D32F2F] hover:text-[#D32F2F] transition">
              <Share2 size={24} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="text-[#D32F2F]" size={20} />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="text-[#D32F2F]" size={20} />
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Package className="text-[#D32F2F]" size={20} />
              <span>Secure Packaging</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-gray-700 mb-1">Expected Delivery:</p>
            <p className="text-sm text-gray-600">
              {formatDeliveryDate(deliveryEstimate.min, deliveryEstimate.max)}
            </p>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="border-t border-gray-200 pt-8">
        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 font-semibold transition ${
              activeTab === 'description'
                ? 'text-[#D32F2F] border-b-2 border-[#D32F2F]'
                : 'text-gray-600 hover:text-[#D32F2F]'
            }`}
          >
            Description
          </button>
          {product.ingredients && product.ingredients.length > 0 && (
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 font-semibold transition ${
                activeTab === 'ingredients'
                  ? 'text-[#D32F2F] border-b-2 border-[#D32F2F]'
                  : 'text-gray-600 hover:text-[#D32F2F]'
              }`}
            >
              Ingredients
            </button>
          )}
          {product.usageInstructions && (
            <button
              onClick={() => setActiveTab('usage')}
              className={`pb-3 font-semibold transition ${
                activeTab === 'usage'
                  ? 'text-[#D32F2F] border-b-2 border-[#D32F2F]'
                  : 'text-gray-600 hover:text-[#D32F2F]'
              }`}
            >
              Usage
            </button>
          )}
          {product.nutritionalInfo && (
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-3 font-semibold transition ${
                activeTab === 'nutrition'
                  ? 'text-[#D32F2F] border-b-2 border-[#D32F2F]'
                  : 'text-gray-600 hover:text-[#D32F2F]'
              }`}
            >
              Nutrition
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="prose max-w-none">
          {activeTab === 'description' && (
            <div>
              <p className="text-gray-700 mb-4">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <>
                  <h3 className="font-bold text-gray-900 mb-2">Key Features:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </>
              )}
              {product.shelfLife && (
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Shelf Life:</strong> {product.shelfLife}
                </p>
              )}
            </div>
          )}
          {activeTab === 'ingredients' && product.ingredients && (
            <div>
              <ul className="list-disc list-inside space-y-1">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'usage' && product.usageInstructions && (
            <div>
              <p className="text-gray-700">{product.usageInstructions}</p>
            </div>
          )}
          {activeTab === 'nutrition' && product.nutritionalInfo && (
            <div>
              <table className="w-full max-w-md">
                <tbody>
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-200">
                      <td className="py-2 font-semibold text-gray-700">{key}</td>
                      <td className="py-2 text-gray-600 text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-4">*Per 100g serving</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


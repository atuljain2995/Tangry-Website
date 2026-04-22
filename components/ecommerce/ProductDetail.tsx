"use client";

import { useState, useCallback } from "react";
import {
  Star,
  Truck,
  Shield,
  Package,
  Plus,
  Minus,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ProductExtended } from "@/lib/types/database";
import {
  formatCurrency,
  calculateDiscountPercentage,
  getStockStatus,
  calculateSavings,
  estimateDeliveryDate,
  formatDeliveryDate,
} from "@/lib/utils/database";
import { useCart } from "@/lib/contexts/CartContext";
import { useWishlist } from "@/lib/contexts/WishlistContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { CartItem } from "@/lib/types/database";
import { ProductImage } from "./ProductImage";
import { PincodeDeliveryCheck } from "./PincodeDeliveryCheck";
import { productImageAlt } from "@/lib/utils/product-image-alt";
import { analytics } from "@/lib/analytics";
import { PRODUCT_CATEGORIES } from "@/lib/data/products";
import Link from "next/link";

interface ProductDetailProps {
  product: ProductExtended;
}

const PLACEHOLDER_IMAGE = "/images/logo-512.png";

export const ProductDetail = ({ product }: ProductDetailProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, cart, updateQuantity } = useCart();
  const { isWishlisted: checkWishlisted, toggle: toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const isWishlisted = checkWishlisted(product.id);

  // Find quantity of this variant already in cart
  const cartItem = cart.items.find(
    (item) => item.productId === product.id && item.variantId === product.variants[selectedVariantIndex]?.id,
  );
  const quantityInCart = cartItem?.quantity || 0;

  const handleWishlist = useCallback(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    toggleWishlist(product.id);
  }, [user, product.id, toggleWishlist]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Tangry Spices!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, [product.name]);

  const getDisplayImage = (index: number) =>
    product.images[index] || PLACEHOLDER_IMAGE;

  // Safety check: ensure product has variants
  if (!product.variants || product.variants.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">
            This product doesn&apos;t have any variants configured. Please
            contact support.
          </p>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const discountPercentage = calculateDiscountPercentage(
    selectedVariant.price,
    selectedVariant.compareAtPrice,
  );
  const savings = calculateSavings(
    selectedVariant.price,
    selectedVariant.compareAtPrice,
  );
  const stockStatus = getStockStatus(selectedVariant.stock);
  const deliveryEstimate = estimateDeliveryDate();
  const parseTextBlocks = (text: string) =>
    text
      .split(/\n\s*\n/g)
      .map((block) => block.trim())
      .filter(Boolean);

  const renderTextBlocks = (blocks: string[], keyPrefix: string) => {
    if (blocks.length === 0) return null;

    const capitalizeFirstCharacter = (text: string) =>
      text.replace(/^(\s*)([a-z])/, (_, leadingWhitespace, firstChar: string) => {
        return `${leadingWhitespace}${firstChar.toUpperCase()}`;
      });

    return blocks.map((block, index) => {
      const labelMatch = block.match(/^([^:\n]{2,40}):\s*([\s\S]+)$/);

      if (labelMatch) {
        const [, label, content] = labelMatch;
        return (
          <div key={`${keyPrefix}-${index}`} className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              {label}
            </h3>
            <p className="text-gray-700 leading-8 whitespace-pre-line">
              {capitalizeFirstCharacter(content)}
            </p>
          </div>
        );
      }

      return (
        <p
          key={`${keyPrefix}-${index}`}
          className="text-gray-700 leading-8 whitespace-pre-line"
        >
          {capitalizeFirstCharacter(block)}
        </p>
      );
    });
  };

  const descriptionBlocks = parseTextBlocks(product.description);
  const usageBlocks = product.usageInstructions
    ? parseTextBlocks(product.usageInstructions)
    : [];

  const handleAddToCart = () => {
    const item: CartItem = {
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity: 1,
      image: product.images[0] || PLACEHOLDER_IMAGE,
    };
    addToCart(item);
    analytics.trackAddToCart(
      product.id,
      product.name,
      1,
      selectedVariant.price,
    );
  };

  const breadcrumbCategory = product.category
    ? PRODUCT_CATEGORIES.find((c) => c.title === product.category)
    : null;

  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    ...(breadcrumbCategory
      ? [{ label: product.category, href: `/categories/${breadcrumbCategory.id}` }]
      : []),
    { label: product.name },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6 overflow-hidden">
        <ol className="flex items-center text-sm min-w-0">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            return (
              <li key={index} className={`flex items-center min-w-0 ${isLast ? "flex-shrink" : "shrink-0"}`}>
                {index > 0 && (
                  <ChevronRight size={14} className="mx-1.5 sm:mx-2 text-gray-300 shrink-0" />
                )}
                {isLast ? (
                  <span className="text-gray-900 font-medium truncate" title={item.label}>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href!}
                    className="text-gray-400 hover:text-orange-600 transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-12 mb-8 sm:mb-12">
        {/* ── Left: Product Images ── */}
        <div>
          {/* Main Image Card */}
          <div className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden bg-white">
            {product.images.length > 0 ||
            getDisplayImage(0) === PLACEHOLDER_IMAGE ? (
              <>
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                    style={{
                      opacity: selectedImageIndex === index ? 1 : 0,
                      zIndex: selectedImageIndex === index ? 1 : 0,
                    }}
                  >
                    <ProductImage
                      src={getDisplayImage(index)}
                      alt={productImageAlt(product.name, selectedVariant.name)}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-[#D32F2F] text-white px-3 py-1 rounded-full text-sm font-bold">
                -{discountPercentage}%
              </div>
            )}
            {/* Badges on image */}
            {(product.isNew || product.isBestSeller || (product.certifications && product.certifications.length > 0)) && (
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 items-end">
                {product.isNew && (
                  <span className="bg-green-600 text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                    New
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-gray-900 text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                    Best Seller
                  </span>
                )}
                {product.certifications?.map((cert, i) => (
                  <span
                    key={i}
                    className="bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Carousel */}
          {product.images.length > 1 && (
            <div className="relative mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? product.images.length - 1 : prev - 1,
                  )
                }
                className="shrink-0 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:border-gray-500 transition"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    type="button"
                    className={`relative shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden transition ${
                      selectedImageIndex === index
                        ? "border-gray-900"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <ProductImage
                      src={getDisplayImage(index)}
                      alt={`${productImageAlt(product.name, selectedVariant.name)} — photo ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === product.images.length - 1 ? 0 : prev + 1,
                  )
                }
                className="shrink-0 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:border-gray-500 transition"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ── Right: Product Info ── */}
        <div>
          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              | &nbsp;{product.reviewCount} Ratings
            </span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline flex-wrap justify-between gap-x-4 gap-y-1 mb-1">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {formatCurrency(selectedVariant.price)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-base sm:text-lg font-semibold text-green-600">
                  -{discountPercentage}%
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              SKU#: {selectedVariant.sku}
            </span>
          </div>

          {/* MRP + Savings + Stock */}
          <div className="flex items-center justify-between mb-1">
            {selectedVariant.compareAtPrice ? (
              <span className="text-sm text-gray-500">
                M.R.P.:{" "}
                <span className="line-through">
                  {formatCurrency(selectedVariant.compareAtPrice)}
                </span>
              </span>
            ) : (
              <span />
            )}
            <span
              className={`text-sm font-semibold ${
                stockStatus.color === "green"
                  ? "text-green-600"
                  : stockStatus.color === "orange"
                    ? "text-orange-600"
                    : "text-red-600"
              }`}
            >
              {stockStatus.label.toUpperCase()}
            </span>
          </div>
          {savings > 0 && (
            <p className="text-sm text-green-600 font-semibold mb-4">
              You save {formatCurrency(savings)} ({discountPercentage}%)
            </p>
          )}

          {/* Short Description */}
          <p className="text-gray-600 leading-7 mb-6">
            {product.description.split("\n")[0]}
          </p>

          {/* Variant / Weight Selector */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                Weight
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariantIndex(index);
                    }}
                    className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition ${
                      selectedVariantIndex === index
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                    } ${!variant.isAvailable || variant.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                    disabled={!variant.isAvailable || variant.stock === 0}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar: Add to Cart / Quantity + Wishlist + Share */}
          <div className="flex items-center flex-wrap gap-3 mb-6">
            {quantityInCart > 0 ? (
              <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2.5">
                <button
                  onClick={() => updateQuantity(product.id, selectedVariant.id, quantityInCart - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="text-sm font-bold text-orange-700 min-w-[1.25rem] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => {
                    if (
                      quantityInCart < selectedVariant.stock &&
                      quantityInCart < (product.maxOrderQuantity || 100)
                    ) {
                      updateQuantity(product.id, selectedVariant.id, quantityInCart + 1);
                    }
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-orange-200 text-orange-600 hover:bg-orange-100 transition"
                  aria-label="Increase quantity"
                  disabled={
                    quantityInCart >= selectedVariant.stock ||
                    quantityInCart >= (product.maxOrderQuantity || 100)
                  }
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant.isAvailable || selectedVariant.stock === 0
                }
                className="flex-1 bg-orange-600 text-white px-5 py-3.5 rounded-lg font-bold text-sm tracking-wide hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                + Add
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`p-2.5 border border-gray-300 rounded-md transition ${
                isWishlisted
                  ? "text-[#D32F2F] border-[#D32F2F]"
                  : "text-gray-500 hover:text-[#D32F2F] hover:border-[#D32F2F]"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2.5 border border-gray-300 rounded-md text-gray-500 hover:text-gray-900 hover:border-gray-500 transition"
              aria-label="Share product"
            >
              <Share2 size={18} />
            </button>
          </div>

          {product.minOrderQuantity > 1 && (
            <p className="text-xs text-gray-500 -mt-4 mb-6">
              Minimum order: {product.minOrderQuantity} units
            </p>
          )}

          {/* Trust Badges */}
          <div className="flex items-center flex-wrap gap-4 sm:gap-6 py-4 border-t border-gray-200 mb-5 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Truck size={18} className="text-gray-400" />
              <span>Pan India Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={18} className="text-gray-400" />
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package size={18} className="text-gray-400" />
              <span>Secure Packaging</span>
            </div>
          </div>

          {/* Pincode Check */}
          <div className="mb-5">
            <PincodeDeliveryCheck />
          </div>

          {/* Delivery Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <p className="font-semibold text-gray-700 mb-1">
              Typical delivery (India):
            </p>
            <p className="text-gray-600">
              {formatDeliveryDate(deliveryEstimate.min, deliveryEstimate.max)}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Use the PIN checker above for a more specific estimate.
            </p>
          </div>
        </div>
      </div>

      {/* ── Product Details (below fold) ── */}
      <div className="border-t border-gray-200 pt-6 sm:pt-10">
        <div className="prose max-w-none space-y-8 sm:space-y-10">
          <section className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Description
            </h3>
            {descriptionBlocks.length > 0 ? (
              renderTextBlocks(descriptionBlocks, "description")
            ) : (
              <p className="text-gray-700 leading-8 whitespace-pre-line">
                {product.description}
              </p>
            )}
          </section>

          {product.features && product.features.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Key Features
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700 leading-8">
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.ingredients && product.ingredients.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Ingredients
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700 leading-8">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.usageInstructions && (
            <section className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Usage
              </h3>
              {usageBlocks.length > 0 ? (
                renderTextBlocks(usageBlocks, "usage")
              ) : (
                <p className="text-gray-700 leading-8 whitespace-pre-line">
                  {product.usageInstructions}
                </p>
              )}
            </section>
          )}

          {product.nutritionalInfo && (
            <section className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Nutrition
              </h3>
              <div className="space-y-3">
                {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                  <p key={key} className="text-gray-700 leading-8">
                    <strong className="text-gray-900">{key}:</strong> {value}
                  </p>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">*Per 100g serving</p>
            </section>
          )}

          {product.shelfLife && (
            <section className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Shelf Life
              </h3>
              <p className="text-gray-700 leading-8">{product.shelfLife}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

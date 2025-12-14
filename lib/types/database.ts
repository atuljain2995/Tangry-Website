// Database types for ecommerce functionality

export type UserRole = 'customer' | 'retailer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  type: 'shipping' | 'billing';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "50g", "100g", "200g"
  sku: string;
  price: number;
  compareAtPrice?: number; // Original price for discounts
  stock: number;
  weight: number; // in grams
  isAvailable: boolean;
}

export interface ProductExtended {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  variants: ProductVariant[];
  images: string[];
  features: string[];
  ingredients?: string[];
  nutritionalInfo?: Record<string, string>;
  usageInstructions?: string;
  shelfLife?: string;
  certifications?: string[]; // e.g., ["ISO", "FSSAI", "Organic"]
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  minOrderQuantity: number; // For B2B
  maxOrderQuantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  productName: string;
  variantName: string;
  price: number;
  image: string;
}

export interface Cart {
  id: string;
  userId?: string; // Optional for guest carts
  sessionId?: string; // For guest users
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

export type PaymentMethod = 
  | 'razorpay' 
  | 'stripe' 
  | 'cod' 
  | 'bank_transfer';

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  subtotal: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type QuoteStatus = 
  | 'pending' 
  | 'reviewed' 
  | 'approved' 
  | 'rejected' 
  | 'converted';

export interface B2BQuote {
  id: string;
  userId: string;
  companyName: string;
  gstNumber?: string;
  contactPerson: string;
  email: string;
  phone: string;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
  message?: string;
  status: QuoteStatus;
  estimatedTotal?: number;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  images?: string[];
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  tags: string[];
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}


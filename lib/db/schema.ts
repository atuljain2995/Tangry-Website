import { sql } from 'drizzle-orm';
import {
  boolean,
  customType,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// Hand-written mirror of the SQL in lib/db/migrations (applied by scripts/neon/bootstrap-schema.ts).
// Keys equal column names and timestamps are ISO strings, so rows keep the shape the app had with Supabase.
const timestamptz = customType<{ data: string; driverData: string }>({
  dataType: () => 'timestamp with time zone',
  fromDriver: (value) => new Date(value).toISOString(),
});

const num = (name: string) => numeric(name, { mode: 'number' });
const id = () => uuid('id').primaryKey().default(sql`uuid_generate_v4()`);
const createdAt = () => timestamptz('created_at').default(sql`now()`);
const updatedAt = () => timestamptz('updated_at').default(sql`now()`);

export const users = pgTable('users', {
  id: id(),
  email: varchar('email').notNull().unique(),
  name: varchar('name'),
  phone: varchar('phone'),
  role: varchar('role').default('customer'),
  password_hash: text('password_hash'),
  avatar_url: text('avatar_url'),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const sessions = pgTable('sessions', {
  id: id(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token').notNull().unique(),
  expires_at: timestamptz('expires_at').notNull(),
  created_at: createdAt(),
});

export const addresses = pgTable('addresses', {
  id: id(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type'),
  full_name: varchar('full_name').notNull(),
  phone: varchar('phone').notNull(),
  address_line1: text('address_line1').notNull(),
  address_line2: text('address_line2'),
  city: varchar('city').notNull(),
  state: varchar('state').notNull(),
  postal_code: varchar('postal_code').notNull(),
  country: varchar('country').default('IN'),
  is_default: boolean('is_default').default(false),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const productCategories = pgTable('product_categories', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull().unique(),
  chip_label: text('chip_label'),
  description: text('description'),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamptz('created_at').notNull().default(sql`now()`),
  updated_at: timestamptz('updated_at').notNull().default(sql`now()`),
});

export const products = pgTable('products', {
  id: id(),
  slug: varchar('slug').notNull().unique(),
  name: varchar('name').notNull(),
  description: text('description'),
  category: varchar('category'),
  category_id: uuid('category_id').references(() => productCategories.id, { onDelete: 'set null' }),
  images: text('images').array().default(sql`'{}'::text[]`),
  variants: jsonb('variants').notNull(),
  features: text('features').array().default(sql`'{}'::text[]`),
  ingredients: text('ingredients').array(),
  tags: text('tags').array().default(sql`'{}'::text[]`),
  meta_title: varchar('meta_title').notNull(),
  meta_description: text('meta_description').notNull(),
  keywords: text('keywords').array().default(sql`'{}'::text[]`),
  is_featured: boolean('is_featured').default(false),
  is_new: boolean('is_new').default(false),
  is_best_seller: boolean('is_best_seller').default(false),
  is_hero_product: boolean('is_hero_product').notNull().default(false),
  discount_enabled: boolean('discount_enabled').notNull().default(false),
  is_bundle: boolean('is_bundle').notNull().default(false),
  shelf_life: text('shelf_life'),
  no_preservatives: boolean('no_preservatives').notNull().default(true),
  is_vegetarian: boolean('is_vegetarian').notNull().default(true),
  storage_instructions: text('storage_instructions')
    .notNull()
    .default('Store in a cool, dry place away from direct sunlight. Keep the pack sealed.'),
  country_of_origin: text('country_of_origin').notNull().default('India'),
  rating: num('rating').default(0),
  review_count: integer('review_count').default(0),
  min_order_quantity: integer('min_order_quantity').default(1),
  max_order_quantity: integer('max_order_quantity'),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const productVariants = pgTable('product_variants', {
  id: id(),
  product_id: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name').notNull(),
  sku: varchar('sku').notNull().unique(),
  price: num('price').notNull(),
  compare_at_price: num('compare_at_price'),
  stock: integer('stock').notNull().default(0),
  weight: integer('weight').notNull(),
  is_available: boolean('is_available').default(true),
  display_order: integer('display_order').notNull().default(0),
  is_default: boolean('is_default').notNull().default(false),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const productImages = pgTable('product_images', {
  id: id(),
  product_id: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  alt_text: varchar('alt_text'),
  display_order: integer('display_order').default(0),
  created_at: createdAt(),
});

export const orders = pgTable('orders', {
  id: id(),
  order_number: varchar('order_number').notNull().unique(),
  user_id: uuid('user_id').references(() => users.id),
  user_email: varchar('user_email').notNull(),
  items: jsonb('items').notNull(),
  subtotal: num('subtotal').notNull(),
  discount: num('discount').default(0),
  tax: num('tax').notNull(),
  shipping: num('shipping').notNull(),
  total: num('total').notNull(),
  currency: varchar('currency').default('INR'),
  order_status: varchar('order_status').default('pending'),
  payment_status: varchar('payment_status').default('pending'),
  payment_method: varchar('payment_method').notNull(),
  payment_id: varchar('payment_id'),
  shipping_address: jsonb('shipping_address').notNull(),
  billing_address: jsonb('billing_address').notNull(),
  tracking_number: varchar('tracking_number'),
  notes: text('notes'),
  delivered_at: timestamptz('delivered_at'),
  review_request_sent_at: timestamptz('review_request_sent_at'),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const reviews = pgTable('reviews', {
  id: id(),
  product_id: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  user_name: varchar('user_name').notNull(),
  rating: integer('rating').notNull(),
  title: varchar('title').notNull(),
  comment: text('comment').notNull(),
  is_verified_purchase: boolean('is_verified_purchase').default(false),
  images: text('images').array(),
  helpful: integer('helpful').default(0),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const coupons = pgTable('coupons', {
  id: id(),
  code: varchar('code').notNull().unique(),
  description: text('description').notNull(),
  discount_type: varchar('discount_type').notNull(),
  discount_value: num('discount_value').notNull(),
  min_order_value: num('min_order_value'),
  max_discount: num('max_discount'),
  usage_limit: integer('usage_limit'),
  usage_count: integer('usage_count').default(0),
  valid_from: timestamptz('valid_from').notNull(),
  valid_until: timestamptz('valid_until').notNull(),
  is_active: boolean('is_active').default(true),
  applicable_products: text('applicable_products').array(),
  applicable_categories: text('applicable_categories').array(),
  first_order_only: boolean('first_order_only').notNull().default(false),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const emailSubscribers = pgTable('email_subscribers', {
  id: id(),
  email: varchar('email').notNull().unique(),
  name: varchar('name'),
  tags: text('tags').array().default(sql`'{}'::text[]`),
  is_active: boolean('is_active').default(true),
  subscribed_at: timestamptz('subscribed_at').default(sql`now()`),
  unsubscribed_at: timestamptz('unsubscribed_at'),
});

export const wishlists = pgTable('wishlists', {
  id: id(),
  user_id: uuid('user_id')
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  product_ids: text('product_ids').array().default(sql`'{}'::text[]`),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const b2bQuotes = pgTable('b2b_quotes', {
  id: id(),
  user_id: uuid('user_id').references(() => users.id),
  company_name: varchar('company_name').notNull(),
  gst_number: varchar('gst_number'),
  contact_person: varchar('contact_person').notNull(),
  email: varchar('email').notNull(),
  phone: varchar('phone').notNull(),
  items: jsonb('items').notNull(),
  message: text('message'),
  status: varchar('status').default('pending'),
  estimated_total: num('estimated_total'),
  admin_notes: text('admin_notes'),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const contactInquiries = pgTable('contact_inquiries', {
  id: id(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull(),
  phone: varchar('phone'),
  subject: varchar('subject'),
  message: text('message').notNull(),
  created_at: createdAt(),
});

export const cwvReadings = pgTable('cwv_readings', {
  id: id(),
  url: varchar('url').notNull(),
  metric_name: varchar('metric_name').notNull(),
  value: num('value').notNull(),
  rating: varchar('rating').notNull(),
  metric_id: varchar('metric_id'),
  delta: num('delta'),
  navigation_type: varchar('navigation_type'),
  created_at: createdAt(),
});

export const adminRebuildRequests = pgTable('admin_rebuild_requests', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  admin_user_id: uuid('admin_user_id').references(() => users.id, { onDelete: 'set null' }),
  admin_email: text('admin_email').notNull(),
  requested_at: timestamptz('requested_at').notNull().default(sql`now()`),
  status: text('status').notNull(),
  message: text('message'),
  response_status: integer('response_status'),
  ip_address: text('ip_address'),
});

export const checkoutEmailOtps = pgTable('checkout_email_otps', {
  id: id(),
  email: text('email').notNull(),
  code_hash: text('code_hash').notNull(),
  expires_at: timestamptz('expires_at').notNull(),
  verify_attempts: integer('verify_attempts').notNull().default(0),
  created_at: timestamptz('created_at').notNull().default(sql`now()`),
});

export const checkoutVerifiedEmails = pgTable('checkout_verified_emails', {
  email: text('email').primaryKey(),
  verified_at: timestamptz('verified_at').notNull().default(sql`now()`),
  last_used_at: timestamptz('last_used_at').notNull().default(sql`now()`),
});

export const recipeRatings = pgTable('recipe_ratings', {
  id: id(),
  recipe_slug: varchar('recipe_slug').notNull(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  user_name: varchar('user_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const recipeRatingTotals = pgTable('recipe_rating_totals', {
  recipe_slug: varchar('recipe_slug').primaryKey(),
  rating_avg: num('rating_avg').notNull().default(0),
  rating_count: integer('rating_count').notNull().default(0),
  updated_at: updatedAt(),
});

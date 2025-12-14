// Supabase database types (auto-generated from schema)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          category: string | null
          subcategory: string | null
          images: string[]
          variants: Json
          features: string[]
          ingredients: string[] | null
          tags: string[]
          meta_title: string
          meta_description: string
          keywords: string[]
          is_featured: boolean
          is_new: boolean
          is_best_seller: boolean
          rating: number
          review_count: number
          min_order_quantity: number
          max_order_quantity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          category?: string | null
          subcategory?: string | null
          images: string[]
          variants: Json
          features?: string[]
          ingredients?: string[] | null
          tags?: string[]
          meta_title: string
          meta_description: string
          keywords?: string[]
          is_featured?: boolean
          is_new?: boolean
          is_best_seller?: boolean
          rating?: number
          review_count?: number
          min_order_quantity?: number
          max_order_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          category?: string | null
          subcategory?: string | null
          images?: string[]
          variants?: Json
          features?: string[]
          ingredients?: string[] | null
          tags?: string[]
          meta_title?: string
          meta_description?: string
          keywords?: string[]
          is_featured?: boolean
          is_new?: boolean
          is_best_seller?: boolean
          rating?: number
          review_count?: number
          min_order_quantity?: number
          max_order_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          user_email: string
          items: Json
          subtotal: number
          discount: number
          tax: number
          shipping: number
          total: number
          currency: string
          order_status: string
          payment_status: string
          payment_method: string
          payment_id: string | null
          shipping_address: Json
          billing_address: Json
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id: string
          user_email: string
          items: Json
          subtotal: number
          discount: number
          tax: number
          shipping: number
          total: number
          currency?: string
          order_status?: string
          payment_status?: string
          payment_method: string
          payment_id?: string | null
          shipping_address: Json
          billing_address: Json
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          user_email?: string
          items?: Json
          subtotal?: number
          discount?: number
          tax?: number
          shipping?: number
          total?: number
          currency?: string
          order_status?: string
          payment_status?: string
          payment_method?: string
          payment_id?: string | null
          shipping_address?: Json
          billing_address?: Json
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          type: string
          full_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          full_name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          postal_code: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          full_name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          user_name: string
          rating: number
          title: string
          comment: string
          is_verified_purchase: boolean
          images: string[] | null
          helpful: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          user_name: string
          rating: number
          title: string
          comment: string
          is_verified_purchase?: boolean
          images?: string[] | null
          helpful?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          user_name?: string
          rating?: number
          title?: string
          comment?: string
          is_verified_purchase?: boolean
          images?: string[] | null
          helpful?: number
          created_at?: string
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string
          discount_type: string
          discount_value: number
          min_order_value: number | null
          max_discount: number | null
          usage_limit: number | null
          usage_count: number
          valid_from: string
          valid_until: string
          is_active: boolean
          applicable_products: string[] | null
          applicable_categories: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description: string
          discount_type: string
          discount_value: number
          min_order_value?: number | null
          max_discount?: number | null
          usage_limit?: number | null
          usage_count?: number
          valid_from: string
          valid_until: string
          is_active?: boolean
          applicable_products?: string[] | null
          applicable_categories?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string
          discount_type?: string
          discount_value?: number
          min_order_value?: number | null
          max_discount?: number | null
          usage_limit?: number | null
          usage_count?: number
          valid_from?: string
          valid_until?: string
          is_active?: boolean
          applicable_products?: string[] | null
          applicable_categories?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      email_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          tags: string[]
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          tags?: string[]
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          tags?: string[]
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}


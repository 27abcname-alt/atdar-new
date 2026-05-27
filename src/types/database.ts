/**
 * Ma'lumotlar bazasi sxemasi (PostgreSQL / Supabase).
 * Jadvallar: Profiles, Listings, Images, Reviews
 */

export type UserRole = "buyer" | "seller" | "moderator";
export type ListingStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  role: UserRole;
  rating: number;
  verified_count: number;
  experience_years: number;
  successful_reviews_count: number;
  joined_at: string;
  updated_at: string;
}

export type ProductCategory = "qurilish" | "texnika" | "kvartira";

export interface Listing {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  condition: string | null;
  usage_duration: string | null;
  location: string | null;
  phone_number: string | null;
  status: ListingStatus;
  moderator_id: string | null;
  rejection_reason: string | null;
  requirements_met: boolean;
  image_url: string | null;
  views_count: number;
  is_verified: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  listing_id: string;
  url: string;
  display_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  listing_id: string;
  author_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
}

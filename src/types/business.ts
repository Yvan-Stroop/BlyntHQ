import { Business as DataForSEOBusiness } from './dataforseo'

export interface Business extends DataForSEOBusiness {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  url?: string;
  address_street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  rating?: {
    rating_type: string;
    value: number;
    votes_count: number;
    rating_max?: number;
  };
  images?: string[];
  work_time?: {
    timetable: string[];
  };
  price_level?: string;
  book_online_url?: string;
  categories?: string[];
  address_info?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country_code?: string;
    region?: string;
  };
  query_category?: string;
  query_state?: string;
  query_city?: string;
  query_timestamp?: string;
}

// Add BusinessQuery interface
export interface BusinessQuery {
  category: string;
  state: string;
  city: string;
  page?: number;
  sortBy?: 'relevance' | 'rating' | 'reviews' | 'distance';
}

// Add to your types file
export interface BreadcrumbLocation {
  city: string;
  state: string;
  state_abbr: string;
  isApprovedLocation: boolean;
} 
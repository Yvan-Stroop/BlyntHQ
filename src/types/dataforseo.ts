export interface BusinessHours {
  timetable: {
    [key: string]: Array<{
      open: { hour: number; minute: number };
      close: { hour: number; minute: number };
    }> | null;
  };
  current_status: "open" | "closed";
}

export interface Business {
  place_id: string;
  title: string;
  slug?: string;
  category?: string;
  additional_categories?: string[];
  city?: string;
  state?: string;
  address_info?: {
    address?: string;
    city?: string;
    region?: string;
    zip?: string;
    country_code?: string;
    borough?: string | null;
  };
  phone?: string;
  url?: string;
  book_online_url?: string;
  work_hours?: BusinessHours;
  main_image?: string;
  images?: string[];
  is_claimed?: boolean;
  rating?: {
    rating_type: string;
    value: number;
    votes_count: number;
    rating_max?: number;
  };
  rating_distribution?: {
    [key: string]: number;
  };
  total_photos?: number;
  latitude?: number;
  longitude?: number;
  price_level?: string;
}

export interface BusinessQuery {
  category: string;
  state: string;
  city: string;
  page?: number;
  sortBy?: 'relevance' | 'rating' | 'reviews' | 'distance';
}

export interface DataForSEOResponse {
  status_code: number;
  status_message: string;
  tasks: Array<{
    id: string;
    status_code: number;
    status_message: string;
    result: Array<{
      items: Business[];
    }>;
  }>;
}

export interface LocationData {
  category: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
}
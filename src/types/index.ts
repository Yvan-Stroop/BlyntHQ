export interface Location {
    city: string;
    state: string;
    state_abbr: string;
    county_fips: string;
    county_name: string;
    lat: number;
    lng: number;
    zips: string[];
    id: string;
  }
  
  export interface Category {
    name: string;
    slug: string;
  }
  
  export interface Business {
    title: string;
    rating?: {
      value: number;
      votes_count: number;
    };
    address?: string;
    phone?: string;
  } 
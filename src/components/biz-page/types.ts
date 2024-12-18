import { Business as DataForSEOBusiness } from "@/types/dataforseo"
import { Business } from "@/types/business"

export interface BusinessHeaderProps {
  business: DataForSEOBusiness & {
    work_hours?: {
      timetable: {
        [key: string]: Array<{
          open: { hour: number; minute: number };
          close: { hour: number; minute: number };
        }> | null;
      };
      current_status?: "open" | "closed";
    };
    address_info?: {
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      country_code?: string;
    };
    category?: string;
    additional_categories?: string[];
    is_claimed?: boolean;
    slug?: string;
    images?: string[];
    main_image?: string;
  };
  category: string;
  searchOrigin?: {
    city: string;
    state: string;
    state_abbr: string;
    category: string;
  };
}

export interface BusinessPhotosProps {
  images?: string[];
  businessTitle: string;
  className?: string;
}

interface TimeSlot {
  hour: number;
  minute: number;
}

interface BusinessHours {
  timetable: {
    [key: string]: Array<{
      open: TimeSlot;
      close: TimeSlot;
    }> | null;
  };
  current_status?: 'open' | 'closed';
}

export interface LocationAndHoursProps {
  address?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  hours?: BusinessHours;
  coordinates?: {
    lat: number;
    lng: number;
  };
  className?: string;
}

export interface ContactSidebarProps {
  phone?: string;
  website?: string;
  bookingUrl?: string;
}

export interface RelatedBusinessesProps {
  business: Business;
  relatedBusinesses: Business[];
  className?: string;
  searchOrigin?: {
    city: string;
    state: string;
    state_abbr: string;
    category: string;
  };
} 
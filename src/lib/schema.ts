import { Business } from "@/types/dataforseo"

interface PriceRangeMap {
  [key: string]: string;
  null: string;
  undefined: string;
}

const PRICE_RANGE_MAP: PriceRangeMap = {
  'null': '$',
  'undefined': '$',
  'PRICE_LEVEL_INEXPENSIVE': '$',
  'PRICE_LEVEL_MODERATE': '$$',
  'PRICE_LEVEL_EXPENSIVE': '$$$',
  'PRICE_LEVEL_VERY_EXPENSIVE': '$$$$'
};

export function generateBusinessSchema(business: Business) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.title,
    "image": business.main_image || null,
    "telephone": business.phone,
    "url": business.url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address_info?.address,
      "addressLocality": business.address_info?.city,
      "addressRegion": business.address_info?.region,
      "postalCode": business.address_info?.zip,
      "addressCountry": business.address_info?.country_code || "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.latitude,
      "longitude": business.longitude
    },
    "aggregateRating": business.rating ? {
      "@type": "AggregateRating",
      "ratingValue": business.rating.value,
      "reviewCount": business.rating.votes_count,
      "bestRating": business.rating.rating_max || 5,
      "worstRating": 1
    } : undefined,
  }
}

export function generateBusinessListSchema(businesses: Business[], city: string, state: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": businesses.map((business, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": business.title,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": business.address_info?.address,
          "addressLocality": business.address_info?.city,
          "addressRegion": business.address_info?.region,
          "postalCode": business.address_info?.zip,
          "addressCountry": "US"
        }
      }
    }))
  }
}

export function generateBreadcrumbSchema(items: Array<{ label: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `https://getblynt.com${item.href}`,
        name: item.label
      }
    }))
  };
}

// Helper function to map business categories to schema.org types
function getCategoryType(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'Accountant': 'AccountingService',
    'Lawyer': 'LegalService',
    'Attorney': 'LegalService',
    'Real estate agent': 'RealEstateAgent',
    'Insurance agency': 'InsuranceAgency',
    'Dentist': 'Dentist',
    'Doctor': 'Physician',
    'Restaurant': 'Restaurant',
    'Hair salon': 'HairSalon',
    'Bank': 'BankOrCreditUnion',
    'Hotel': 'LodgingBusiness',
    'Store': 'Store',
    'Retail': 'Store',
    'Gym': 'GymOrFitnessCenter',
    'School': 'School',
    'Hospital': 'Hospital',
    'Pharmacy': 'Pharmacy',
    'Auto repair': 'AutoRepair',
    'Car dealer': 'AutoDealer',
    'Tire Shop': 'AutoRepair',
    'Liquor Store': 'LiquorStore',
    'Supermarket': 'GroceryStore',
    'Fitness Center': 'GymOrFitnessCenter',
    'Dollar Store': 'Store',
    'Wedding Venue': 'EventVenue',
    'Beauty Salon': 'BeautySalon',
    'Law Firm': 'LegalService',
    // Add more mappings as needed
  };

  return categoryMap[category] || 'LocalBusiness';
}

// Generate Organization schema for the website itself
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://getblynt.com/#organization',
    name: 'Blynt',
    url: 'https://getblynt.com',
    logo: 'https://getblynt.com/logo.png',
    description: 'Find and discover local businesses across the United States',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@getblynt.com'
    }
  };
}

// Generate WebSite schema
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://getblynt.com/#website',
    url: 'https://getblynt.com',
    name: 'Blynt',
    description: 'Find and discover local businesses across the United States',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://getblynt.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// Helper functions
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatTime({ hour, minute }: { hour: number; minute: number }): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
} 
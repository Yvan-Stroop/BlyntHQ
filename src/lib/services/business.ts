import { supabase } from '@/lib/supabase'
import { fetchLocalbusiness } from '@/lib/dataforseo'
import type { Business as DataForSEOBusiness, BusinessQuery } from '@/types/dataforseo'
import { generateUniqueSlug, normalizeUrlCity, isValidCity } from '@/lib/utils'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { headers } from 'next/headers'

const CONFIG = {
  RESULTS_PER_PAGE: 10,
  API_DELAY: 1000,
  COST_PER_REQUEST: 0.002,
} as const

// State mapping
const STATE_MAP: Record<string, string> = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming'
};

interface ExtendedBusiness extends DataForSEOBusiness {
  resultType: 'exact' | 'related' | 'nearby';
  slug: string;
}

interface ExtendedBusinessResponse {
  businesses: ExtendedBusiness[];
  totalCount: number;
  exactCount: number;
  relatedCount: number;
  nearbyCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Transform database business to extended business format
async function transformToExtendedBusiness(
  dbBusiness: any, 
  resultType: 'exact' | 'related' | 'nearby'
): Promise<ExtendedBusiness> {
  // Parse work_time if it's a string
  let workHours = null;
  if (dbBusiness.work_time) {
    try {
      workHours = typeof dbBusiness.work_time === 'string' 
        ? JSON.parse(dbBusiness.work_time) 
        : dbBusiness.work_time;
    } catch (e) {
      console.error('Error parsing work hours:', e);
    }
  }

  return {
    ...dbBusiness,
    address_info: {
      address: dbBusiness.address_street,
      city: dbBusiness.city,
      region: dbBusiness.state,
      zip: dbBusiness.zip,
      country_code: dbBusiness.country_code || 'US'
    },
    // Use existing slug from database
    slug: dbBusiness.slug,
    category: dbBusiness.category || undefined,
    additional_categories: dbBusiness.additional_categories || [],
    phone: dbBusiness.phone || undefined,
    url: dbBusiness.url || undefined,
    work_hours: workHours,
    main_image: dbBusiness.main_image || undefined,
    is_claimed: true,
    rating: dbBusiness.rating_value ? {
      rating_type: 'Max5',
      value: dbBusiness.rating_value,
      votes_count: dbBusiness.rating_count || 0,
      rating_max: 5
    } : undefined,
    rating_distribution: dbBusiness.rating_distribution || undefined,
    resultType,
    latitude: dbBusiness.latitude || undefined,
    longitude: dbBusiness.longitude || undefined,
    title: dbBusiness.title,
    place_id: dbBusiness.place_id || dbBusiness.id
  }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get coordinates for a city from CSV data
function getCityCoordinates(city: string, state: string): { lat: number; lng: number } | null {
  try {
    const csvContent = readFileSync('src/data/locations.csv', 'utf-8');
    const records = parse(csvContent, { columns: true });
    
    const cityRecord = records.find((record: any) => 
      record.city.toLowerCase() === city.toLowerCase() && 
      record.state_abbr === state
    );

    if (cityRecord) {
      return {
        lat: parseFloat(cityRecord.lat),
        lng: parseFloat(cityRecord.lng)
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading city coordinates:', error);
    return null;
  }
}

// Calculate business score based on various factors
function calculateBusinessScore(business: any, cityLat?: number, cityLng?: number, isExactCityMatch: boolean = false): number {
  // Base score multiplier for exact city matches
  const cityMultiplier = isExactCityMatch ? 1000 : 1;  // Ensures exact city matches are always on top

  // Rating Score (0-25 points)
  const ratingScore = (business.rating_value || 0) * 5;  // 5 stars * 5 = 25 points max

  // Review Count Score (0-15 points)
  // Logarithmic scale to handle large differences in review counts
  const reviewScore = Math.min(
    business.rating_count ? (Math.log(business.rating_count) * 2) : 0,
    15
  );

  // Location Score (0-10 points)
  let locationScore = isExactCityMatch ? 10 : 0; // Full points for exact city match
  if (cityLat && cityLng && business.latitude && business.longitude) {
    const distance = calculateDistance(
      cityLat,
      cityLng,
      business.latitude,
      business.longitude
    );
    // Reduce points based on distance for non-local businesses
    // More gradual distance decay: up to 30km with diminishing returns
    locationScore = isExactCityMatch ? 10 : Math.max(0, 10 - (distance * 0.33));
  }

  // Quality Indicators (0-15 points)
  const qualityScore = (
    (business.is_claimed ? 4 : 0) +         // Verified business (higher weight)
    (business.url ? 3 : 0) +                // Has website
    (business.address_street ? 3 : 0) +     // Has address
    (business.work_time ? 3 : 0) +          // Has hours
    (business.main_image ? 2 : 0)           // Has image
  );

  // Category Match Score (0-10 points)
  const categoryMatchScore = business.category?.toLowerCase().includes(business.searchedCategory?.toLowerCase()) ? 10 : 
    (business.additional_categories?.some((cat: string) => 
      cat.toLowerCase().includes(business.searchedCategory?.toLowerCase())
    ) ? 5 : 0);

  // Total possible base score: 75 points
  // - Rating: 25 points (33.3%)
  // - Reviews: 15 points (20%)
  // - Location: 10 points (13.3%)
  // - Quality: 15 points (20%)
  // - Category Match: 10 points (13.3%)
  
  // Final score calculation with city multiplier
  const baseScore = ratingScore + reviewScore + locationScore + qualityScore + categoryMatchScore;
  return baseScore * cityMultiplier;
}

interface SortOptions {
  field: 'relevance' | 'rating' | 'reviews' | 'distance';
  direction: 'asc' | 'desc';
}

// Define our Business type that matches our Supabase schema
export interface Business extends DataForSEOBusiness {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  url?: string;
  address_street?: string;
  city: string;
  state: string;
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
}

// Add this function to generate business slugs
function generateBusinessSlug(business: {
  title: string;
  city: string;
  state: string;
}): string {
  const titleSlug = business.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  const citySlug = business.city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  const stateSlug = business.state.toLowerCase()

  return `${titleSlug}-${citySlug}-${stateSlug}`
}

// Update the getBusiness function
export async function getBusiness(slug: string, includeRelated: boolean = false): Promise<Business | null> {
  try {
    // First try to find by exact slug
    let { data: businessBySlug, error: slugError } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!slugError && businessBySlug) {
      console.log('Found business by exact slug match')
      return transformBusinessData(businessBySlug)
    }

    // If not found, try case-insensitive search
    const { data: businessByILikeSlug, error: iLikeError } = await supabase
      .from('businesses')
      .select('*')
      .ilike('slug', slug)
      .single()

    if (!iLikeError && businessByILikeSlug) {
      console.log('Found business by case-insensitive slug match')
      return transformBusinessData(businessByILikeSlug)
    }

    console.log('Business not found in database')
    return null
  } catch (error) {
    console.error('Error in getBusiness:', error)
    throw error
  }
}

function transformBusinessData(business: any): Business {
  return {
    ...business,
    place_id: business.place_id || business.id,
    address_info: {
      address: business.address_street,
      city: business.city,
      state: business.state,
      zip: business.zip,
      country_code: business.country_code || 'US',
      region: business.state
    },
    rating: business.rating_value ? {
      rating_type: 'Max5',
      value: business.rating_value,
      votes_count: business.rating_count || 0,
      rating_max: 5
    } : undefined,
    work_hours: business.work_time ? {
      timetable: typeof business.work_time === 'string' ? 
        JSON.parse(business.work_time).timetable : 
        business.work_time.timetable,
      current_status: typeof business.work_time === 'string' ?
        JSON.parse(business.work_time).current_status :
        business.work_time.current_status
    } : undefined,
    url_safe_city: normalizeUrlCity(business.city),
    query_category: business.query_category,
    query_state: business.query_state,
    query_city: business.query_city
  } as Business
}

const debugLog = (message: string, data: any) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    console.log(`\n[Debug ${timestamp}] ${message}`, data);
  }
};

// Check if we've already fetched this category-location combination
async function hasBeenFetched(category: string, city: string, state: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('category_location_fetches')
    .select('id')
    .eq('category', category)
    .eq('city', city)
    .eq('state', state)
    .single();

  if (error) {
    return false; // If there's an error, assume we haven't fetched it
  }

  return !!data;
}

export async function getBusinesses(query: BusinessQuery): Promise<ExtendedBusinessResponse> {
  const startTime = performance.now();
  const { category, state, city, page = 1 } = query;
  const skip = (page - 1) * CONFIG.RESULTS_PER_PAGE;

  try {
    // Format category properly - map from URL format to database format
    const categoryMap: Record<string, string> = {
      'ac-repair-service': 'Air conditioning repair service',
      // Add more mappings as needed
    };
    const formattedCategory = categoryMap[category] || category.replace(/-/g, ' ');
    const formattedCity = city.replace(/-/g, ' ');
    const formattedState = STATE_MAP[state.toUpperCase()] || state;

    // Validate city exists using existing isValidCity function
    if (!isValidCity(formattedCity, state.toUpperCase())) {
      throw new Error(`Invalid city: ${formattedCity}, ${state}`);
    }

    // Get city coordinates for scoring
    const cityCoords = getCityCoordinates(formattedCity, state.toUpperCase());

    debugLog('Query parameters:', {
      originalCategory: category,
      formattedCategory,
      city: formattedCity,
      state: formattedState,
      coords: cityCoords
    });

    // Check if we've already fetched this combination
    const alreadyFetched = await hasBeenFetched(
      formattedCategory,
      formattedCity,
      formattedState
    );

    // If not fetched, fetch from API first
    if (!alreadyFetched) {
      debugLog('Location not yet fetched, fetching from API', {
        category: formattedCategory,
        city: formattedCity,
        state: formattedState
      });

      try {
        const apiResponse = await fetchLocalbusiness(
          formattedCategory,
          formattedCity,
          formattedState
        );

        const apiBusinesses = apiResponse.tasks?.[0]?.result?.[0]?.items || [];
        
        // Transform and store API results
        await Promise.all(
          apiBusinesses.map(async (business) => {
            // Skip businesses with missing city data
            if (!business.address_info?.city) {
              debugLog('Skipping business due to missing city:', {
                title: business.title,
                address_info: business.address_info
              });
              return;
            }

            const slug = await generateUniqueSlug(
              business.title,
              business.address_info?.city,
              business.address_info?.address
            );

            const transformedBusiness = {
              slug,
              place_id: business.place_id,
              title: business.title,
              category: business.category,
              address_street: business.address_info?.address,
              city: business.address_info?.city,
              state: STATE_MAP[business.address_info?.region || formattedState] || business.address_info?.region || formattedState,
              zip: business.address_info?.zip,
              country_code: business.address_info?.country_code || 'US',
              work_time: business.work_hours,
              main_image: business.main_image,
              rating_value: business.rating?.value,
              rating_count: business.rating?.votes_count,
              rating_type: 'Max5',
              rating_max: 5,
              is_claimed: true,
              latitude: business.latitude,
              longitude: business.longitude,
              phone: business.phone,
              url: business.url,
              book_online_url: business.book_online_url,
              price_level: business.price_level,
              total_photos: business.total_photos,
              rating_distribution: business.rating_distribution,
              additional_categories: business.additional_categories || [],
              query_category: formattedCategory,
              query_state: formattedState,
              query_city: formattedCity,
              query_timestamp: new Date().toISOString()
            };

            // Store in database
            const { error: insertError } = await supabase
              .from('businesses')
              .upsert(transformedBusiness, {
                onConflict: 'place_id'
              });

            if (insertError) {
              debugLog('Error storing business:', insertError);
            }
          })
        );

        // Track category location fetch
        const { error: fetchTrackError } = await supabase
          .from('category_location_fetches')
          .upsert({
            category: formattedCategory,
            city: formattedCity,
            state: formattedState,
            fetched_at: new Date().toISOString()
          }, {
            onConflict: 'category,city,state'
          });

        if (fetchTrackError) {
          debugLog('Error tracking category location fetch:', fetchTrackError);
        }

      } catch (apiError) {
        debugLog('API fetch error:', apiError);
      }
    } else {
      debugLog('Location was already fetched, skipping API call', {
        category: formattedCategory,
        city: formattedCity,
        state: formattedState
      });
    }

    // Format category with only first letter of first word capitalized for additional_categories matching
    const formattedCategoryForArray = formattedCategory
      .toLowerCase()
      .replace(/^[a-z]/, letter => letter.toUpperCase());

    // Database query - match exact category in main category or additional categories
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('state', formattedState)
      .or(`category.ilike."${formattedCategory}",additional_categories.cs.{"${formattedCategoryForArray}"}`)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) {
      debugLog('Database error:', error);
      throw error;
    }

    debugLog('Database query params:', {
      state: formattedState,
      category: formattedCategory,
      categoryForArray: formattedCategoryForArray,
      query: `category.ilike."${formattedCategory}",additional_categories.cs.{"${formattedCategoryForArray}"}`,
      resultsFound: businesses?.length || 0
    });

    let matchedBusinesses = businesses || [];

    // Calculate scores and add metadata for all businesses
    const businessesWithScores = await Promise.all(matchedBusinesses.map(async business => {
      const isExactCityMatch = business.city.toLowerCase() === formattedCity.toLowerCase();
      const score = calculateBusinessScore(
        business, 
        cityCoords?.lat, 
        cityCoords?.lng,
        isExactCityMatch
      );
      const distance = cityCoords && business.latitude && business.longitude ? 
        calculateDistance(
          cityCoords.lat,
          cityCoords.lng,
          business.latitude,
          business.longitude
        ) : Infinity;

      const transformedBusiness = await transformToExtendedBusiness(
        business,
        isExactCityMatch ? 'exact' : 'nearby'
      );

      return {
        ...transformedBusiness,
        searchedCategory: formattedCategory,
        isExactCityMatch,
        score,
        distance
      };
    }));

    // Sort results
    const sortedBusinesses = businessesWithScores.sort((a, b) => {
      const scoreDiff = b.score - a.score;
      if (scoreDiff !== 0) return scoreDiff;
      return a.distance - b.distance;
    });

    const exactCount = sortedBusinesses.filter(b => b.isExactCityMatch).length;
    const nearbyCount = sortedBusinesses.filter(b => !b.isExactCityMatch).length;

    debugLog('Processed results:', {
      totalTime: `${Math.round(performance.now() - startTime)}ms`,
      totalBusinesses: sortedBusinesses.length,
      exactMatches: exactCount,
      nearbyMatches: nearbyCount,
      topResults: sortedBusinesses.slice(0, 5).map(b => ({
        city: b.city,
        score: Math.round(b.score * 100) / 100,
        distance: Math.round(b.distance * 10) / 10,
        isExact: b.isExactCityMatch
      }))
    });

    const paginatedBusinesses = sortedBusinesses
      .slice(skip, skip + CONFIG.RESULTS_PER_PAGE)
      .map(business => ({
        ...business,
        resultType: business.isExactCityMatch ? 'exact' as const : 'nearby' as const
      }));

    return {
      businesses: paginatedBusinesses,
      totalCount: sortedBusinesses.length,
      exactCount,
      relatedCount: 0,
      nearbyCount,
      currentPage: page,
      totalPages: Math.ceil(sortedBusinesses.length / CONFIG.RESULTS_PER_PAGE),
      hasNextPage: skip + CONFIG.RESULTS_PER_PAGE < sortedBusinesses.length,
      hasPreviousPage: page > 1
    };
  } catch (error) {
    debugLog('Error in getBusinesses:', error);
    throw error;
  }
}

// Function to get related businesses from the database
export async function getRelatedBusinesses({
  businessId,
  category,
  city,
  state,
  limit = 8
}: {
  businessId: string;
  category: string;
  city: string;
  state: string;
  limit?: number;
}): Promise<Business[]> {
  try {
    // First, get businesses from the same city and category
    let { data: sameCityAndCategory } = await supabase
      .from('businesses')
      .select('*')
      .neq('id', businessId) // Exclude current business
      .eq('city', city)
      .eq('state', state)
      .eq('category', category)
      .limit(limit);

    let results = sameCityAndCategory || [];

    // If we need more results, get businesses from same city with similar categories
    if (results.length < limit) {
      const remainingLimit = limit - results.length;
      const { data: sameCityRelatedCategory } = await supabase
        .from('businesses')
        .select('*')
        .neq('id', businessId)
        .eq('city', city)
        .eq('state', state)
        .neq('category', category) // Different main category
        .contains('additional_categories', [category]) // But has the category in additional categories
        .limit(remainingLimit);

      if (sameCityRelatedCategory) {
        results = [...results, ...sameCityRelatedCategory];
      }
    }

    // If we still need more results, get businesses from nearby cities
    if (results.length < limit) {
      const remainingLimit = limit - results.length;
      const { data: nearbyCities } = await supabase
        .from('businesses')
        .select('*')
        .neq('id', businessId)
        .eq('state', state)
        .neq('city', city)
        .eq('category', category)
        .limit(remainingLimit);

      if (nearbyCities) {
        results = [...results, ...nearbyCities];
      }
    }

    // Transform the results to match the Business type
    return results.map(business => ({
      ...business,
      address_info: {
        address: business.address_street,
        city: business.city,
        state: business.state,
        zip: business.zip,
        country_code: business.country_code || 'US'
      },
      rating: business.rating_value ? {
        rating_type: 'Max5',
        value: business.rating_value,
        votes_count: business.rating_count || 0,
        rating_max: 5
      } : undefined
    }));
  } catch (error) {
    console.error('Error fetching related businesses:', error);
    return [];
  }
}
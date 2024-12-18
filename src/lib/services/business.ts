import { supabase } from '@/lib/supabase'
import { fetchLocalbusiness } from '@/lib/dataforseo'
import type { Business as DataForSEOBusiness, BusinessQuery } from '@/types/dataforseo'
import { generateUniqueSlug, normalizeUrlCity, isValidCity } from '@/lib/utils'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { headers } from 'next/headers'
import { loadCategoriesFromCSV } from '@/lib/csv'

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
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

// Calculate business score based on various factors
export function calculateBusinessScore(
  business: Business,
  targetLat: number,
  targetLng: number,
  isExactCityMatch: boolean,
  cityZipCodes: string[]
): number {
  let score = 50; // Base score

  // Location-based scoring
  if (cityZipCodes.includes(business.zip ?? '')) {
    score += 40; // ZIP code match bonus
  }
  
  if (isExactCityMatch) {
    score += 30; // Exact city match bonus
  }

  // Distance-based penalties
  const distance = calculateDistance(
    targetLat,
    targetLng,
    business.latitude ?? 0,
    business.longitude ?? 0
  );
  
  if (distance <= 5) {
    // 0-5km: -1.5 points per km
    score -= distance * 1.5;
  } else if (distance <= 20) {
    // 5-20km: First -7.5 points from first tier, then -2 points per km
    score -= 7.5 + ((distance - 5) * 2);
  } else {
    // >20km: Previous penalties plus additional
    score -= 37.5 + ((distance - 20) * 2.5);
  }

  // Quality signals scoring
  if (business.rating?.value) {
    // Rating value: up to 10 points (2 points per star)
    score += Math.min(business.rating.value * 2, 10);
  }

  if (business.rating?.votes_count) {
    // Review count: up to 5 points (logarithmic scale)
    score += Math.min(Math.log2(business.rating.votes_count), 5);
  }

  // Additional quality signals
  if (business.is_claimed) score += 3;
  if (business.url) score += 2;
  if (business.work_time) score += 2;

  return score;
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

// Check if we've already fetched this category-location combination
async function hasBeenFetched(category: string, city: string, state: string): Promise<boolean> {
  const normalizedInputCity = normalizeUrlCity(city);
  
  // Get all records for this category and state
  const { data, error } = await supabase
    .from('category_location_fetches')
    .select('*')
    .eq('category', category)
    .eq('state', state);

  if (error) {
    return false; // If there's an error, assume we haven't fetched it
  }

  // Compare normalized versions of city names
  return data?.some(record => normalizeUrlCity(record.city) === normalizedInputCity) || false;
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
    const formattedCity = normalizeUrlCity(city);
    const formattedState = STATE_MAP[state.toUpperCase()] || state;

    // Validate city exists using existing isValidCity function
    if (!isValidCity(formattedCity, state.toUpperCase())) {
      throw new Error(`Invalid city: ${formattedCity}, ${state}`);
    }

    // Get city coordinates and ZIP codes for scoring
    const cityLocation = getCityLocation(formattedCity, state.toUpperCase());
    if (!cityLocation) {
      throw new Error(`City location data not found: ${formattedCity}, ${state}`);
    }

    const cityLat = parseFloat(cityLocation.lat.toString());
    const cityLng = parseFloat(cityLocation.lng.toString());
    const cityZipCodes = cityLocation.zips.split(' ');

    // Check if we've already fetched this combination
    const alreadyFetched = await hasBeenFetched(
      formattedCategory,
      formattedCity,
      formattedState
    );

    // If not fetched, fetch from API first
    if (!alreadyFetched) {
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
              console.error('Error storing business:', insertError);
            }
          })
        );

        // Track category location fetch
        const { error: fetchTrackError } = await supabase
          .from('category_location_fetches')
          .upsert({
            category: formattedCategory,
            city: city, // Store the original city name
            state: formattedState,
            fetched_at: new Date().toISOString()
          }, {
            onConflict: 'category,city,state'
          });

        if (fetchTrackError) {
          console.error('Error tracking category location fetch:', fetchTrackError);
        }

      } catch (apiError) {
        console.error('API fetch error:', apiError);
      }
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
      console.error('Database error:', error);
      throw error;
    }

    let matchedBusinesses = businesses || [];

    // Calculate scores and add metadata for all businesses
    const businessesWithScores = await Promise.all(matchedBusinesses.map(async business => {
      const isExactCityMatch = business.city.toLowerCase() === formattedCity.toLowerCase();
      const isInCityZipCode = cityZipCodes.includes(business.zip);
      
      const distance = calculateDistance(
        cityLat,
        cityLng,
        parseFloat(business.latitude!),
        parseFloat(business.longitude!)
      );

      const score = calculateBusinessScore(
        business,
        cityLat,
        cityLng,
        isExactCityMatch,
        cityZipCodes
      );

      const transformedBusiness = await transformToExtendedBusiness(
        business,
        isExactCityMatch ? 'exact' : 'nearby'
      );

      return {
        ...transformedBusiness,
        searchedCategory: formattedCategory,
        isExactCityMatch,
        isInCityZipCode,
        score,
        distance
      };
    }));

    // Filter businesses within 20km and sort by score and distance
    const filteredAndSortedBusinesses = businessesWithScores
      .filter(business => business.distance <= 20)
      .sort((a, b) => {
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
        return a.distance - b.distance;
      });

    // Calculate result statistics
    const exactCount = filteredAndSortedBusinesses.filter(b => b.isExactCityMatch).length;
    const zipCodeCount = filteredAndSortedBusinesses.filter(b => b.isInCityZipCode).length;
    const nearbyCount = filteredAndSortedBusinesses.filter(b => !b.isExactCityMatch && !b.isInCityZipCode).length;

    // Paginate results
    const paginatedBusinesses = filteredAndSortedBusinesses
      .slice(skip, skip + CONFIG.RESULTS_PER_PAGE)
      .map(business => ({
        ...business,
        resultType: business.isExactCityMatch ? 'exact' as const : 'nearby' as const
      }));

    return {
      businesses: paginatedBusinesses,
      totalCount: filteredAndSortedBusinesses.length,
      exactCount,
      relatedCount: zipCodeCount - exactCount, // Businesses in ZIP code but not exact city match
      nearbyCount,
      currentPage: page,
      totalPages: Math.ceil(filteredAndSortedBusinesses.length / CONFIG.RESULTS_PER_PAGE),
      hasNextPage: skip + CONFIG.RESULTS_PER_PAGE < filteredAndSortedBusinesses.length,
      hasPreviousPage: page > 1
    };
  } catch (error) {
    console.error('Error in getBusinesses:', error);
    throw error;
  }
}

// Helper function to get city location data including coordinates and ZIP codes
function getCityLocation(city: string, stateAbbr: string): { lat: number; lng: number; zips: string } | null {
  try {
    const csvContent = readFileSync('src/data/locations.csv', 'utf-8');
    const records = parse(csvContent, { columns: true });
    
    const location = records.find((record: any) => 
      normalizeUrlCity(record.city) === normalizeUrlCity(city) && 
      record.state_abbr === stateAbbr
    );

    if (location) {
      return {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
        zips: location.zips
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading city location data:', error);
    return null;
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

// Function to get all businesses for a location page
export async function getLocationBusinesses({
  state,
  city
}: {
  state: string;
  city: string;
}): Promise<{
  businesses: Business[];
  categories: Array<{
    category: string;
    slug: string;
    count: number;
    businesses: Array<{
      title: string;
      rating?: number;
      reviews?: number;
      resultType: 'exact' | 'related' | 'nearby';
    }>;
  }>;
  totalCount: number;
  exactCount: number;
  relatedCount: number;
  nearbyCount: number;
}> {
  try {
    // Format location properly
    const formattedCity = normalizeUrlCity(city)
    const formattedState = STATE_MAP[state.toUpperCase()] || state

    // Get city coordinates and ZIP codes for scoring
    const cityLocation = getCityLocation(formattedCity, state.toUpperCase())
    if (!cityLocation) {
      throw new Error(`City location data not found: ${formattedCity}, ${state}`)
    }

    const cityLat = parseFloat(cityLocation.lat.toString())
    const cityLng = parseFloat(cityLocation.lng.toString())
    const cityZipCodes = cityLocation.zips.split(' ')

    // Load categories first - this is our source of truth
    const categories = await loadCategoriesFromCSV()
    
    // Process each category in parallel
    const categoryResults = await Promise.all(
      categories.map(async (category) => {
        // Format category properly - match the format used in getBusinesses
        const formattedCategory = category.name.toLowerCase()
        const formattedCategoryForArray = category.name
          .toLowerCase()
          .replace(/^[a-z]/, letter => letter.toUpperCase())

        // First get the total count for this category
        const { count: totalCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('state', formattedState)
          .or(`category.ilike."${formattedCategory}",additional_categories.cs.{"${formattedCategoryForArray}"}`)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)

        // If no businesses, skip further queries
        if (!totalCount) return null

        // Get all businesses for this category using pagination
        const allBusinesses: any[] = []
        let page = 0
        const pageSize = 1000

        while (page * pageSize < totalCount) {
          const { data: pageBusinesses, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('state', formattedState)
            .or(`category.ilike."${formattedCategory}",additional_categories.cs.{"${formattedCategoryForArray}"}`)
            .not('latitude', 'is', null)
            .not('longitude', 'is', null)
            .range(page * pageSize, (page + 1) * pageSize - 1)

          if (error) {
            console.error(`Error fetching businesses for category ${category.name}:`, error)
            break
          }

          if (pageBusinesses) {
            allBusinesses.push(...pageBusinesses)
          }

          page++
        }

        if (!allBusinesses.length) {
          return null
        }

        // Apply same scoring and filtering as category page
        const scoredBusinesses = allBusinesses.map(business => {
          const isExactCityMatch = business.city.toLowerCase() === formattedCity.toLowerCase()
          const isInCityZipCode = cityZipCodes.includes(business.zip)
          
          const distance = calculateDistance(
            cityLat,
            cityLng,
            parseFloat(business.latitude!),
            parseFloat(business.longitude!)
          )

          const score = calculateBusinessScore(
            business,
            cityLat,
            cityLng,
            isExactCityMatch,
            cityZipCodes
          )

          return {
            ...business,
            isExactCityMatch,
            isInCityZipCode,
            score,
            distance,
            resultType: isExactCityMatch ? 'exact' as const : 'nearby' as const
          }
        })

        // Filter by distance and sort
        const filteredBusinesses = scoredBusinesses
          .filter(business => business.distance <= 20)
          .sort((a, b) => {
            const scoreDiff = b.score - a.score
            if (scoreDiff !== 0) return scoreDiff
            return a.distance - b.distance
          })

        if (filteredBusinesses.length === 0) {
          return null
        }

        return {
          category: category.name,
          slug: category.slug,
          count: filteredBusinesses.length,
          businesses: filteredBusinesses
            .slice(0, 3)
            .map(business => ({
              title: business.title,
              rating: business.rating_value,
              reviews: business.rating_count,
              resultType: business.resultType
            })),
          allBusinesses: filteredBusinesses // Keep all businesses for statistics
        }
      })
    )

    // Filter out categories with no businesses
    const activeCategories = categoryResults.filter((result): result is NonNullable<typeof result> => 
      result !== null
    )

    // Combine all businesses for statistics
    const allBusinesses = activeCategories.flatMap(cat => cat.allBusinesses)

    // Calculate statistics
    const exactCount = allBusinesses.filter(b => b.isExactCityMatch).length
    const zipCodeCount = allBusinesses.filter(b => b.isInCityZipCode).length
    const nearbyCount = allBusinesses.filter(b => !b.isExactCityMatch && !b.isInCityZipCode).length

    return {
      businesses: allBusinesses,
      categories: activeCategories
        .map(({ category, slug, count, businesses }) => ({
          category,
          slug,
          count,
          businesses
        }))
        .sort((a, b) => a.category.localeCompare(b.category)), // Sort alphabetically by category name
      totalCount: allBusinesses.length,
      exactCount,
      relatedCount: zipCodeCount - exactCount,
      nearbyCount
    }
  } catch (error) {
    console.error('Error in getLocationBusinesses:', error)
    throw error
  }
}
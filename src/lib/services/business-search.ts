import { supabase } from '@/lib/supabase'
import { fetchLocalbusiness, storeBusinessInSupabase } from '@/lib/dataforseo'
import type { Business, DataForSEOResponse } from '@/types/dataforseo'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { generateUniqueSlug, normalizeUrlCity } from '@/lib/utils'
import { loadCategoriesFromCSV } from '@/lib/csv'
import { cache } from 'react'
import path from 'path'

// Configuration
const CONFIG = {
  RESULTS_PER_PAGE: 10,
  DEFAULT_COUNTRY: 'US'
}

// Types
interface SearchQuery {
  category: string;
  state: string;
  city: string;
  page?: number;
}

interface SearchResponse {
  businesses: Business[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  exactCount: number;
  relatedCount: number;
  nearbyCount: number;
  averageRating?: number;
  priceRange?: string;
  popularAreas?: string[];
}

// Check if we've already fetched this category-location combination
async function hasBeenFetched(category: string, city: string, state: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('category_location_fetches')
    .select('id')
    .eq('category', category.toLowerCase())
    .eq('city', normalizeUrlCity(city))
    .eq('state', state.toUpperCase())
    .single()

  if (error) {
    return false // If there's an error, assume we haven't fetched it
  }

  return !!data
}

// Mark a category-location combination as fetched
async function markAsFetched(category: string, city: string, state: string): Promise<void> {
  const { error } = await supabase
    .from('category_location_fetches')
    .upsert({
      category: category.toLowerCase(),
      city: normalizeUrlCity(city),
      state: state.toUpperCase(),
      fetched_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error marking fetch:', error)
  }
}

// Helper function to get location data
function getLocationData(city: string, stateAbbr: string): { city: string; state: string; state_abbr: string } | null {
  try {
    const csvContent = readFileSync(path.join(process.cwd(), 'src', 'data', 'locations.csv'), 'utf-8');
    const records = parse(csvContent, { columns: true });
    
    const location = records.find((record: any) => 
      normalizeUrlCity(record.city) === normalizeUrlCity(city) && 
      record.state_abbr.toUpperCase() === stateAbbr.toUpperCase()
    );

    if (location) {
      return {
        city: location.city,
        state: location.state,
        state_abbr: location.state_abbr
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading location data:', error);
    return null;
  }
}

// Helper function to transform business data
function transformBusinessData(business: any): Business {
  return {
    ...business,
    place_id: business.place_id,
    title: business.title,
    category: business.category?.toLowerCase(),
    additional_categories: business.additional_categories || [],
    address_info: {
      address: business.address_street,
      city: business.city,
      region: business.state,
      zip: business.zip,
      country_code: business.country_code || 'US'
    },
    rating: business.rating_value ? {
      rating_type: 'Max5',
      value: business.rating_value,
      votes_count: business.rating_count || 0,
      rating_max: 5
    } : undefined,
    work_hours: business.work_time,
    latitude: business.latitude,
    longitude: business.longitude
  }
}

// Database-only search function - no API calls
export async function searchBusinessesFromDB({ 
  category, 
  state, 
  city 
}: Omit<SearchQuery, 'page'>): Promise<Business[]> {
  try {
    const formattedCategory = category.replace(/-/g, ' ').toLowerCase()
    const formattedCity = city.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    const locationData = getLocationData(formattedCity, state)
    const fullStateName = locationData?.state

    if (!fullStateName) {
      console.log('No state found for DB search:', { state, city: formattedCity })
      return []
    }

    const { data: existingBusinesses, error: queryError } = await supabase
      .from('businesses')
      .select('*')
      .ilike('state', fullStateName)
      .ilike('city', formattedCity)
      .eq('category', formattedCategory)
      .limit(100)

    if (queryError) {
      console.error('Database query error:', JSON.stringify(queryError))
      return []
    }

    if (!existingBusinesses || existingBusinesses.length === 0) {
      return []
    }

    return existingBusinesses.map(transformBusinessData)
  } catch (error) {
    console.error('Database search error:', error)
    return []
  }
}

// Cached version of the search function
export const searchBusinesses = cache(async function searchBusinessesImpl({ 
  category, 
  state, 
  city, 
  page = 1 
}: SearchQuery): Promise<SearchResponse> {
  try {
    // Get proper category name from categories.csv
    const categories = await loadCategoriesFromCSV()
    const categoryDetails = categories.find(cat => cat.slug === category)
    
    if (!categoryDetails) {
      console.error('Category not found in categories.csv:', category)
      return {
        businesses: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        exactCount: 0,
        relatedCount: 0,
        nearbyCount: 0
      }
    }

    // Always use the proper name from categories.csv
    const formattedCategory = categoryDetails.name
    const formattedCity = city.replace(/-/g, ' ')
    const formattedState = state.toUpperCase()

    // Check if we need to fetch from API
    const alreadyFetched = await hasBeenFetched(formattedCategory, formattedCity, formattedState)
    let shouldFetchFromAPI = !alreadyFetched

    // Format the category with proper capitalization (only first word)
    const properCaseCategory = formattedCategory
      .toLowerCase()
      .replace(/^[a-z]/, letter => letter.toUpperCase());

    // Get state name mapping
    const locationData = getLocationData(formattedCity, formattedState)
    const fullStateName = locationData?.state || formattedState

    // Query for main category matches
    const { data: mainCategoryBusinesses, error: mainError } = await supabase
      .from('businesses')
      .select('*')
      .eq('state', fullStateName)
      .ilike('city', formattedCity)
      .ilike('category', formattedCategory)

    if (mainError) {
      console.error('Supabase main category query error:', mainError)
      throw mainError
    }

    // Query for additional categories matches
    const { data: additionalCategoryBusinesses, error: additionalError } = await supabase
      .from('businesses')
      .select('*')
      .eq('state', fullStateName)
      .ilike('city', formattedCity)
      .contains('additional_categories', [properCaseCategory])

    if (additionalError) {
      console.error('Supabase additional categories query error:', additionalError)
      throw additionalError
    }

    // Combine results and remove duplicates
    const allBusinesses = [...(mainCategoryBusinesses || []), ...(additionalCategoryBusinesses || [])]
    const uniqueBusinesses = Array.from(new Map(allBusinesses.map(item => [item.place_id, item])).values())
      .map(business => ({
        ...business,
        work_hours: typeof business.work_time === 'string' 
          ? JSON.parse(business.work_time)
          : business.work_time,
        rating: business.rating_value ? {
          rating_type: 'Max5',
          value: business.rating_value,
          votes_count: business.rating_count || 0,
          rating_max: 5
        } : undefined,
        is_claimed: business.is_claimed || false
      }))

    // If no results and not fetched before, try API
    if (uniqueBusinesses.length === 0 && shouldFetchFromAPI) {
      try {
        const apiResponse = await fetchLocalbusiness(
          formattedCategory,
          formattedCity,
          formattedState
        )

        const apiBusinesses = apiResponse.tasks?.[0]?.result?.[0]?.items || []
        
        // Transform API businesses
        const transformedBusinesses = await Promise.all(
          apiBusinesses.map(async (business) => {
            if (!business.title || !business.address_info?.city) {
              return null;
            }

            const slug = await generateUniqueSlug(
              business.title, 
              business.address_info.city,
              business.address_info.address
            )

            return {
              ...business,
              slug,
              place_id: business.place_id,
              title: business.title,
              address_street: business.address_info.address,
              city: business.address_info.city,
              state: business.address_info.region || formattedState,
              zip: business.address_info.zip,
              country_code: business.address_info.country_code || 'US',
              work_time: business.work_hours,
              rating_value: business.rating?.value,
              rating_count: business.rating?.votes_count,
              rating_type: 'Max5',
              rating_max: 5,
              category: business.category,
              additional_categories: business.additional_categories || [],
              is_claimed: business.is_claimed || false
            }
          })
        )

        // Filter out null values
        const validBusinesses = transformedBusinesses.filter((business): business is NonNullable<typeof business> => business !== null)

        // Store businesses
        if (validBusinesses.length > 0) {
          await storeBatch(validBusinesses, { category: formattedCategory, state: formattedState, city: formattedCity })
          await markAsFetched(formattedCategory, formattedCity, formattedState)
          return {
            businesses: validBusinesses,
            totalCount: validBusinesses.length,
            currentPage: page,
            totalPages: Math.ceil(validBusinesses.length / CONFIG.RESULTS_PER_PAGE),
            hasNextPage: page * CONFIG.RESULTS_PER_PAGE < validBusinesses.length,
            hasPreviousPage: page > 1,
            exactCount: validBusinesses.length,
            relatedCount: 0,
            nearbyCount: 0
          }
        }
      } catch (apiError) {
        console.error('API error:', apiError)
      }
    }

    return {
      businesses: uniqueBusinesses,
      totalCount: uniqueBusinesses.length,
      currentPage: page,
      totalPages: Math.ceil(uniqueBusinesses.length / CONFIG.RESULTS_PER_PAGE),
      hasNextPage: page * CONFIG.RESULTS_PER_PAGE < uniqueBusinesses.length,
      hasPreviousPage: page > 1,
      exactCount: uniqueBusinesses.length,
      relatedCount: 0,
      nearbyCount: 0
    }
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
})

interface CategoryDetails {
  name: string;
  slug: string;
  description?: string;
}

export async function getCategoryDetails(slug: string): Promise<CategoryDetails | null> {
  try {
    const categories = await loadCategoriesFromCSV()
    const category = categories.find(cat => cat.slug === slug)
    
    if (!category) {
      return null
    }

    return {
      name: category.name,
      slug: category.slug,
      description: `Find local ${category.name.toLowerCase()} businesses and services in your area.`
    }
  } catch (error) {
    console.error('Error getting category details:', error)
    return null
  }
}

// Store a batch of businesses with query information
async function storeBatch(businesses: Business[], queryInfo: { category: string; state: string; city: string }) {
  try {
    const results = await Promise.all(
      businesses.map(business => storeBusinessInSupabase(business, queryInfo)
        .catch(error => {
          console.error(`Failed to store business ${business.place_id}:`, error);
          return null;
        })
      )
    );
    
    const successfulStores = results.filter(result => result !== null);
    console.log(`Successfully stored ${successfulStores.length} out of ${businesses.length} businesses`);
    
    return successfulStores;
  } catch (error) {
    console.error('Error in storeBatch:', error);
    throw error;
  }
}
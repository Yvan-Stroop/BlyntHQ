import axios from 'axios';
import { DataForSEOResponse, Business } from '@/types/dataforseo';
import { supabase } from '@/lib/supabase';
import { generateUniqueSlug } from '@/lib/utils';

// Define our own type for Axios error response
type ApiErrorResponse = {
  response?: {
    status?: number;
    data?: DataForSEOResponse;
  };
  message: string;
};

if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
  throw new Error('DataForSEO credentials not found in environment variables');
}

const auth = Buffer.from(
  `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
).toString('base64');

const BASE_URL = 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced';

export async function fetchLocalbusiness(
  category: string,
  city: string,
  state: string
): Promise<DataForSEOResponse> {
  try {
    const formattedCity = city
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    console.log('Fetching businesses:', { category, city: formattedCity, state });

    const keyword = `${category} ${formattedCity} ${state}`;

    const payload = [
      {
        keyword: keyword,
        location_code: 2840,
        language_code: "en",
        device: "desktop",
        os: "windows",
        depth: 100
      }
    ];

    const response = await axios.post<DataForSEOResponse>(BASE_URL, payload, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid API response format');
    }

    const items = response.data.tasks?.[0]?.result?.[0]?.items;

    if (!items?.length) {
      console.warn('No results found for the given criteria');
    } else {
      console.log(`Found ${items.length} total results from API`);
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      const apiError = error as Error & ApiErrorResponse;
      console.error('DataForSEO API Error:', {
        status: apiError.response?.status,
        data: apiError.response?.data,
        message: apiError.message,
      });

      if (apiError.response?.status === 401) {
        throw new Error('Invalid DataForSEO credentials');
      }

      const errorMessage = 
        apiError.response?.data?.tasks?.[0]?.status_message || 
        apiError.response?.data?.status_message || 
        apiError.message;
        
      throw new Error(`DataForSEO API error: ${errorMessage}`);
    }

    throw error;
  }
}

// Export this function so it can be used by other modules
export async function storeBusinessInSupabase(business: Business, queryInfo?: { category: string; state: string; city: string }) {
  // Use a fixed timestamp for both server and client
  const timestamp = new Date().toISOString().split('.')[0] + '.000Z';
  
  try {
    // Validate required fields
    if (!business.title) {
      console.log('Skipping business: Missing title');
      return null;
    }

    // Get city and state from either address_info or the business object directly
    const city = business.address_info?.city || business.city
    const state = business.address_info?.region || business.state

    if (!city || !state) {
      console.log('Skipping business: Missing location data');
      return null;
    }

    // Generate slug only if we have all required data
    const slug = await generateUniqueSlug(
      business.title, 
      city,
      business.address_info?.address
    );

    // Prepare the data to match the exact database schema
    const businessData = {
      place_id: business.place_id,
      title: business.title,
      slug,
      category: business.category?.toLowerCase() || null,
      additional_categories: business.additional_categories || [],
      address_street: business.address_info?.address || null,
      city,
      state,
      zip: business.address_info?.zip || null,
      country_code: business.address_info?.country_code || 'US',
      latitude: business.latitude || null,
      longitude: business.longitude || null,
      phone: business.phone || null,
      url: business.url || null,
      work_time: business.work_hours || null,
      main_image: business.main_image || null,
      rating_value: business.rating?.value || null,
      rating_count: business.rating?.votes_count || null,
      created_at: timestamp,
      updated_at: timestamp,
      // Add query tracking fields
      query_category: queryInfo?.category || null,
      query_state: queryInfo?.state || null,
      query_city: queryInfo?.city || null,
      query_timestamp: timestamp
    };

    // First check if business already exists
    const { data: existingBusiness } = await supabase
      .from('businesses')
      .select('place_id')
      .eq('place_id', business.place_id)
      .single();

    if (existingBusiness) {
      // If business exists, update it
      const { data, error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('place_id', business.place_id);

      if (error) {
        console.error('Error updating business:', {
          error,
          businessId: business.place_id,
          title: business.title
        });
        throw error;
      }
      return data;
    } else {
      // If business doesn't exist, insert it
      const { data, error } = await supabase
        .from('businesses')
        .insert([businessData]);

      if (error) {
        console.error('Error inserting business:', {
          error,
          businessId: business.place_id,
          title: business.title
        });
        throw error;
      }
      return data;
    }
  } catch (error: unknown) {
    console.error('Error in storeBusinessInSupabase:', {
      error,
      businessId: business.place_id,
      title: business.title,
      city: business.address_info?.city,
      state: business.address_info?.region
    });
    
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      console.log('Duplicate business, skipping:', business.place_id);
      return null;
    }
    throw error;
  }
}

export async function storeBatch(
  businesses: Business[],
  queryInfo?: { category: string; state: string; city: string }
) {
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
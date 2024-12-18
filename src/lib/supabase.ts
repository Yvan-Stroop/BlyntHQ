import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Add this function to test the connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('count')
      .single()

    if (error) {
      console.error('Supabase connection test error:', error)
      return false
    }

    console.log('Supabase connection successful, count:', data)
    return true
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}
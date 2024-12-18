export type Json =
| string
| number
| boolean
| null
| { [key: string]: Json | undefined }
| Json[]

export interface Database {
public: {
  Tables: {
    businesses: {
      Row: {
        id: string
        title: string
        slug: string
        category: string | null
        state: string | null
        city: string | null
        featured: boolean
        status: 'published' | 'draft' | 'archived'
        updated_at: string
        created_at: string
        address_info: Json | null
        work_hours: Json | null
        main_image: string | null
        latitude: number | null
        longitude: number | null
        query_category: string | null
        query_state: string | null
        query_city: string | null
        query_timestamp: string | null
      }
    }
    }
  }
}
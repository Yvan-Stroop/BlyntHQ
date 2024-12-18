import path from 'path'
import { promises as fs } from 'fs'
import { parse } from 'csv-parse/sync'
import { normalizeUrlCity } from './utils'

export interface Category {
  name: string
  slug: string
}

export interface Location {
  city: string
  state: string
  state_abbr: string
  county_fips: string
  county_name: string
  lat: number
  lng: number
  zips: string
  id: string
}

export interface StateCity {
  [key: string]: {
    name: string;
    cities: {
      [key: string]: {
        name: string;
      };
    };
  };
}

// Cache the CSV data in memory
let categoriesCache: Category[] | null = null
let locationsCache: Location[] | null = null

export async function loadCategoriesFromCSV() {
  // Return cached data if available
  if (categoriesCache) return categoriesCache

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'categories.csv')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    categoriesCache = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as Category[]
    return categoriesCache
  } catch (error) {
    console.error('Error loading categories:', error)
    return []
  }
}

export async function loadLocationsFromCSV() {
  // Return cached data if available
  if (locationsCache) return locationsCache

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'locations.csv')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    locationsCache = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as Location[]
    return locationsCache
  } catch (error) {
    console.error('Error loading locations:', error)
    return []
  }
}

export function transformLocationsToStateCity(locations: Location[]): StateCity {
  const states: StateCity = {}
  
  locations.forEach(location => {
    const stateAbbr = location.state_abbr
    const citySlug = normalizeUrlCity(location.city)
    
    // Initialize state if it doesn't exist
    if (!states[stateAbbr]) {
      states[stateAbbr] = {
        name: location.state,
        cities: {}
      }
    }
    
    // Add city to state
    states[stateAbbr].cities[citySlug] = {
      name: location.city
    }
  })
  
  return states
} 
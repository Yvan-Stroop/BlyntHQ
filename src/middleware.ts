import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { normalizeUrlCity } from './lib/utils'
import { loadCategoriesFromCSV, loadLocationsFromCSV } from './lib/csv'

// Cache for categories and locations
let categoriesCache: Array<{ name: string; slug: string }> | null = null
let locationsCache: Array<{ city: string; state: string; state_abbr: string }> | null = null

// List of blocked countries
const BLOCKED_COUNTRIES = ['DE', 'IR', 'RU', 'IN'] // Germany, Iran, Russia, India

// Function to load and cache data
async function ensureCacheLoaded() {
  if (!categoriesCache) {
    categoriesCache = await loadCategoriesFromCSV()
  }
  if (!locationsCache) {
    locationsCache = await loadLocationsFromCSV()
  }
}

// Helper function to find closest category
function findClosestCategory(categorySlug: string): string | null {
  if (!categoriesCache) return null
  
  // First try exact match
  const exactMatch = categoriesCache.find(c => c.slug === categorySlug)
  if (exactMatch) return exactMatch.slug

  // Try matching without hyphens
  const normalized = categorySlug.replace(/-/g, '')
  const similarMatch = categoriesCache.find(c => 
    c.slug.replace(/-/g, '').toLowerCase() === normalized.toLowerCase()
  )
  if (similarMatch) return similarMatch.slug

  // Handle common variations
  const categoryMappings: Record<string, string> = {
    'auto-body-shop': 'mechanic',
    'auto-repair-shop': 'mechanic',
    'car-repair-and-maintenance-service': 'mechanic',
    'medical-center': 'dental-clinic',
    'attorney': 'law-firm',
    'event-venue': 'wedding-venue',
    'gym': 'fitness-center',
    'recreation-center': 'fitness-center',
    'community-center': 'fitness-center',
    'nail-salon': 'beauty-salon',
    'childrens-clothing-store': 'baby-store',
    'department-store': 'dollar-store',
    'custom-home-builder': 'construction-company',
    'remodeler': 'construction-company',
    'auto-insurance-agency': 'insurance-company',
    'insurance-agency': 'insurance-company',
    'brewing-supply-store': 'liquor-store',
    'engine-rebuilding-service': 'mechanic',
    'solar-energy-company': 'construction-company',
    'gutter-cleaning': 'gutter-cleaning-service',
    'window-cleaning': 'window-cleaning-service',
    'ac-repair': 'ac-repair-service'
  }

  return categoryMappings[categorySlug] || null
}

export async function middleware(request: NextRequest) {
  // Skip all middleware in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // Get country from headers
  const countryCode = request.headers.get('x-vercel-ip-country')
  
  // Block if from restricted countries
  if (countryCode && BLOCKED_COUNTRIES.includes(countryCode)) {
    return new NextResponse('Access denied: This service is not available in your region.', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  const url = request.nextUrl
  const parts = url.pathname.split('/')

  // Only process category pages
  if (!url.pathname.startsWith('/categories/')) {
    return NextResponse.next()
  }

  // Extract parts from URL for category pages
  if (parts.length < 3) {
    return NextResponse.next()
  }

  const [, , category, state, city] = parts

  // Ensure cache is loaded
  await ensureCacheLoaded()

  // Handle specific redirect for ac-repair-service to air-conditioning-repair-service
  if (category === 'ac-repair-service') {
    const newPath = url.pathname.replace('/ac-repair-service/', '/air-conditioning-repair-service/');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check category and location
  const closestCategory = findClosestCategory(category)
  
  // If we have state and city
  if (state && city) {
    const locationExists = locationsCache?.some(loc => 
      loc.state_abbr.toLowerCase() === state.toLowerCase() &&
      normalizeUrlCity(loc.city) === normalizeUrlCity(city)
    )

    // Handle category redirects
    if (closestCategory && closestCategory !== category) {
      return NextResponse.redirect(new URL(`/categories/${closestCategory}/${state}/${city}`, request.url))
    }

    // Handle location redirects
    if (!locationExists && locationsCache?.some(loc => loc.state_abbr.toLowerCase() === state.toLowerCase())) {
      return NextResponse.redirect(new URL(`/categories/${category}/${state}`, request.url))
    }
  }
  // If we only have state
  else if (state) {
    const stateExists = locationsCache?.some(loc => 
      loc.state_abbr.toLowerCase() === state.toLowerCase()
    )

    if (!stateExists) {
      return NextResponse.redirect(new URL(`/categories/${category}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|api).*)',
  ],
} 
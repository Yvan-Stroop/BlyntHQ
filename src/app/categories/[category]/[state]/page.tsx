import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { loadCategoriesFromCSV, loadLocationsFromCSV, Location } from '@/lib/csv'
import { getStateNameFromAbbreviation } from '@/lib/locations'
import { getBusinesses } from '@/lib/services/business'
import { StateHeader } from '@/components/state-page/state-header'
import { CitiesList } from '@/components/state-page/cities-list'
import { StateInfo } from '@/components/state-page/state-info'
import { PopularCities } from '@/components/state-page/popular-cities'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { formatLocationName, normalizeUrlCity } from '@/lib/utils'
import { generateStatePageSchema } from '@/lib/schemas'

// Force dynamic rendering to handle RSC requests
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    category: string;
    state: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { category, state } = resolvedParams
  const formattedCategory = formatLocationName(category)

  const stateName = getStateNameFromAbbreviation(state.toUpperCase())

  if (!stateName) return notFound()

  const title = `Best ${formattedCategory} in ${stateName} - Find Local ${formattedCategory} Services`
  const description = `Find and compare the best ${formattedCategory.toLowerCase()} in ${stateName}. Browse ratings, reviews, and contact information for local ${formattedCategory.toLowerCase()} businesses across ${stateName}.`
  const canonicalUrl = `https://getblynt.com/categories/${category.toLowerCase()}/${state.toLowerCase()}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Blynt'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: canonicalUrl
    },
    other: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  }
}

interface CityBusiness {
  name: string;
  slug: string;
  businessCount: number;
  averageRating: number;
  topBusinesses: string[];
}

async function getCityBusinesses(location: Location, category: string, state: string, currentPage: number) {
  try {
    const businesses = await getBusinesses({
      category: category,
      state: state,
      city: normalizeUrlCity(location.city),
      page: currentPage
    })
    
    return {
      name: location.city,
      slug: normalizeUrlCity(location.city),
      businessCount: businesses.totalCount,
      averageRating: businesses.businesses.reduce((acc, b) => acc + (b.rating?.value || 0), 0) / businesses.totalCount || 0,
      topBusinesses: businesses.businesses
        .sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0))
        .slice(0, 3)
        .map(b => b.title)
    }
  } catch (error) {
    console.error(`Error fetching businesses for ${location.city}:`, error)
    return {
      name: location.city,
      slug: normalizeUrlCity(location.city),
      businessCount: 0,
      averageRating: 0,
      topBusinesses: []
    }
  }
}

export default async function CategoryStatePage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  const { category: categorySlug, state } = resolvedParams
  const currentPage = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1
  
  try {
    const [categories, locationData] = await Promise.all([
      loadCategoriesFromCSV(),
      loadLocationsFromCSV()
    ])
    
    const category = categories.find(c => c.slug === categorySlug)
    const stateLocations = locationData.filter((l: Location) => 
      l.state_abbr.toLowerCase() === state.toLowerCase()
    )

    if (!category || !stateLocations.length) {
      return notFound()
    }

    const stateName = getStateNameFromAbbreviation(state.toUpperCase())
    if (!stateName) return notFound()

    // First check which cities are valid from our locations.csv
    const validCities = new Set(
      locationData
        .filter(l => l.state_abbr.toLowerCase() === state.toLowerCase())
        .map(l => l.city.toLowerCase())
    )

    const allCityBusinesses = await Promise.all(
      stateLocations
        .filter(location => validCities.has(location.city.toLowerCase()))
        .map(location => getCityBusinesses(location, category.slug, state, currentPage))
    )

    const citiesWithBusinesses = allCityBusinesses.filter((c: CityBusiness) => c.businessCount > 0)

    const totalBusinesses = citiesWithBusinesses.reduce((acc: number, city: { businessCount: number }) => 
      acc + city.businessCount, 0)
      
    const averageRating = citiesWithBusinesses.reduce((acc: number, city: { averageRating: number }) => 
      acc + city.averageRating, 0) / citiesWithBusinesses.length

    // Get popular cities from our valid cities
    const popularCities = citiesWithBusinesses
      .sort((a, b) => b.businessCount - a.businessCount)
      .slice(0, 3)
      .map(city => ({
        name: city.name,
        slug: city.slug,
        businessCount: city.businessCount,
        averageRating: city.averageRating,
        topBusinesses: city.topBusinesses
      }))

    const pageUrl = `https://getblynt.com/categories/${category.slug}/${state.toLowerCase()}`
    const pageSchema = generateStatePageSchema({
      category,
      state: {
        name: stateName,
        abbr: state.toUpperCase()
      },
      cities: citiesWithBusinesses,
      url: pageUrl
    })

    // Generate breadcrumbs
    const breadcrumbs = [
      {
        type: 'categories' as const,
        label: 'Categories',
        href: '/categories',
        description: 'Browse all business categories'
      },
      {
        type: 'category' as const,
        label: category.name,
        href: `/categories/${category.slug}`,
        description: `Find ${category.name.toLowerCase()} businesses`
      },
      {
        type: 'state' as const,
        label: stateName,
        href: `/categories/${category.slug}/${state.toLowerCase()}`,
        description: `${category.name} in ${stateName}`
      }
    ]

    return (
      <main>      
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} className="py-4" />
        </div>
        
        <StateHeader 
          category={category}
          state={{
            name: stateName,
            abbr: state.toUpperCase()
          }}
          totalCities={citiesWithBusinesses.length}
          totalBusinesses={totalBusinesses}
        />

        <div className="container py-8">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <CitiesList 
                cities={citiesWithBusinesses}
                category={category}
                state={{
                  name: stateName,
                  abbr: state.toUpperCase()
                }}
              />
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted rounded-lg" />}>
                <StateInfo 
                  category={category}
                  state={{
                    name: stateName,
                    abbr: state.toUpperCase()
                  }}
                  statistics={{
                    totalBusinesses,
                    totalCities: citiesWithBusinesses.length,
                    averageRating,
                    popularCities: popularCities.map(c => c.name),
                    coveragePercentage: Math.round((citiesWithBusinesses.length / stateLocations.length) * 100)
                  }}
                />

                {citiesWithBusinesses.length > 0 && (
                  <PopularCities 
                    cities={popularCities}
                    category={category}
                    state={{
                      name: stateName,
                      abbr: state.toUpperCase()
                    }}
                  />
                )}
              </Suspense>
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageSchema)
          }}
        />
      </main>
    )
  } catch (error) {
    console.error('Error in CategoryStatePage:', error)
    return notFound()
  }
} 
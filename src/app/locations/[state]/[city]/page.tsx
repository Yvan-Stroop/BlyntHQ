import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { loadLocationsFromCSV, loadCategoriesFromCSV, Location } from '@/lib/csv'
import { getStateNameFromAbbreviation } from '@/lib/locations'
import { getLocationBusinesses } from '@/lib/services/business'
import { formatLocationName, normalizeUrlCity } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { 
  IconMapPin, 
  IconBuilding,
  IconArrowRight,
  IconUsers,
  IconCategory,
  IconStar
} from '@tabler/icons-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

interface PageProps {
  params: Promise<{
    state: string;
    city: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { state, city } = resolvedParams
  const stateName = getStateNameFromAbbreviation(state.toUpperCase())
  const cityName = formatLocationName(city)

  if (!stateName) return notFound()

  const title = `Local Businesses in ${cityName}, ${stateName} - Find Services & Companies`
  const description = `Browse and discover local businesses in ${cityName}, ${stateName}. Find reviews, contact information, and business details for companies in your area.`

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
      canonical: `https://getblynt.com/locations/${state.toLowerCase()}/${normalizeUrlCity(city)}`
    }
  }
}

export default async function CityLocationPage({ params }: PageProps) {
  const resolvedParams = await params
  const { state, city } = resolvedParams
  const [locations, categories] = await Promise.all([
    loadLocationsFromCSV(),
    loadCategoriesFromCSV()
  ])
  
  const stateName = getStateNameFromAbbreviation(state.toUpperCase())
  if (!stateName) return notFound()

  // Check if URL needs normalization
  const normalizedCity = normalizeUrlCity(city)
  if (city !== normalizedCity) {
    redirect(`/locations/${state.toLowerCase()}/${normalizedCity}`)
  }

  const cityName = formatLocationName(normalizedCity)
  
  // Get city location data
  const cityLocation = locations.find(
    loc => loc.state === stateName && 
    normalizeUrlCity(loc.city) === normalizeUrlCity(cityName)
  )
  if (!cityLocation) {
    return notFound()
  }

  // Get all businesses for this location
  const { categories: activeCategories, exactCount: exactCityMatches, relatedCount, nearbyCount, totalCount } = 
    await getLocationBusinesses({
      state: state,
      city: normalizedCity
    })

  console.log(`Found ${activeCategories.length} categories with businesses`)
  console.log('Results distribution:', {
    categories: activeCategories.length,
    totalBusinesses: totalCount,
    exactCityMatch: exactCityMatches,
    relatedCount,
    nearby: nearbyCount
  })

  // If no businesses found at all, show 404
  if (totalCount === 0) {
    return notFound()
  }

  // Generate breadcrumbs
  const breadcrumbs = [
    {
      type: 'locations' as const,
      label: 'Locations',
      href: '/locations',
      description: 'Browse all locations'
    },
    {
      type: 'state' as const,
      label: stateName,
      href: `/locations/${state.toLowerCase()}`,
      description: `Browse businesses in ${stateName}`
    },
    {
      type: 'city' as const,
      label: cityName,
      href: `/locations/${state.toLowerCase()}/${city}`,
      description: `Browse businesses in ${cityName}, ${stateName}`
    }
  ]

  return (
    <main>
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container py-8 space-y-4">
          <Breadcrumbs items={breadcrumbs} className="mb-4" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg">
              <IconMapPin className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Local Businesses in {cityName}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse and discover local businesses across {activeCategories.length} categories 
            {exactCityMatches > 0 ? (
              ` in ${cityName}, ${stateName}.`
            ) : (
              ` near ${cityName}, ${stateName}.`
            )}
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-8">
          {nearbyCount > 0 && (
            <div className="rounded-lg border bg-card text-card-foreground p-4">
              <p className="text-sm text-muted-foreground">
                {exactCityMatches > 0 ? (
                  `Showing businesses in ${cityName} and nearby areas.`
                ) : (
                  `Showing businesses within 20km of ${cityName}.`
                )}
              </p>
            </div>
          )}
          {/* Popular Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Popular Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategories.map((category) => (
                <Card key={category.slug} className="hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 rounded-lg">
                            <IconCategory className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{category.category}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.count} {category.count === 1 ? 'business' : 'businesses'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Top Businesses */}
                      <div className="space-y-2">
                        {category.businesses.map((business, index) => (
                          <div key={`${category.slug}-${business.title}-${index}`} className="flex items-center gap-2">
                            <IconBuilding className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {business.title}
                              {business.rating && (
                                <span className="ml-2 flex items-center text-yellow-500">
                                  <IconStar className="w-3 h-3 fill-current" />
                                  <span className="ml-1">{business.rating.toFixed(1)}</span>
                                </span>
                              )}
                              {business.resultType !== 'exact' && (
                                <span className="ml-2 text-xs text-muted-foreground">(nearby)</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                        <Link href={`/categories/${category.slug}/${state.toLowerCase()}/${normalizeUrlCity(city)}`}>
                          View All
                          <IconArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
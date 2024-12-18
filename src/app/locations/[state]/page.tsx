import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { loadLocationsFromCSV, Location } from '@/lib/csv'
import { getStateNameFromAbbreviation } from '@/lib/locations'
import { formatLocationName, normalizeUrlCity } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { 
  IconMapPin, 
  IconBuilding,
  IconArrowRight,
  IconUsers,
  IconCategory
} from '@tabler/icons-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

interface PageProps {
  params: Promise<{
    state: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { state } = resolvedParams
  const stateName = getStateNameFromAbbreviation(state.toUpperCase())

  if (!stateName) return notFound()

  const title = `Local Businesses in ${stateName} - Find Services & Companies Near You`
  const description = `Browse local businesses and services across cities in ${stateName}. Find reviews, contact information, and business details in your area.`

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
      canonical: `https://getblynt.com/locations/${state.toLowerCase()}`
    }
  }
}

export default async function StateLocationPage({ params }: PageProps) {
  const resolvedParams = await params
  const { state } = resolvedParams
  const locations = await loadLocationsFromCSV()
  
  const stateName = getStateNameFromAbbreviation(state.toUpperCase())
  if (!stateName) return notFound()

  const stateLocations = locations.filter((l: Location) => 
    l.state_abbr.toLowerCase() === state.toLowerCase()
  ).sort((a, b) => a.city.localeCompare(b.city))

  if (!stateLocations.length) {
    return notFound()
  }

  // Group cities by first letter for alphabetical organization
  const citiesByLetter = stateLocations.reduce<Record<string, Location[]>>((acc, location) => {
    const firstLetter = location.city.charAt(0).toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(location)
    return acc
  }, {})

  const sortedLetters = Object.keys(citiesByLetter).sort()

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
              Local Businesses in {stateName}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse and discover local businesses across {stateLocations.length.toLocaleString()}+ cities in {stateName}.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-12">
          {sortedLetters.map((letter) => (
            <div key={letter} id={letter.toLowerCase()} className="scroll-m-20">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xl font-bold text-primary">{letter}</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {citiesByLetter[letter].map((location) => (
                  <Card key={location.city} className="hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 rounded-lg">
                            <IconBuilding className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{location.city}</h3>
                            <p className="text-sm text-muted-foreground">
                              {stateName}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href={`/locations/${state.toLowerCase()}/${normalizeUrlCity(location.city)}`}>
                              <IconCategory className="w-4 h-4" />
                              Browse Businesses
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alphabet Navigation */}
        <div className="sticky bottom-4 mt-8">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-full p-2 max-w-fit mx-auto shadow-lg">
            <div className="flex flex-wrap justify-center gap-1">
              {sortedLetters.map((letter) => (
                <Button
                  key={letter}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                  asChild
                >
                  <a href={`#${letter.toLowerCase()}`}>
                    {letter}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
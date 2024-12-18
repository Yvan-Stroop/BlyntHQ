import { Metadata } from 'next'
import { loadLocationsFromCSV, Location } from '@/lib/csv'
import { Button } from '@/components/ui/button'
import { 
  IconMapPin,
  IconArrowRight,
  IconBuilding,
  IconUsers
} from '@tabler/icons-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'

export const metadata: Metadata = {
  title: 'Browse Locations - Find Local Businesses Across the United States',
  description: 'Explore our directory of business locations across the United States. Find local businesses and services in your state or city.',
}

interface StateGroup {
  name: string
  abbr: string
  cities: Location[]
}

export default async function LocationsPage() {
  const locations = await loadLocationsFromCSV()

  // Group locations by state
  const stateGroups = locations.reduce<Record<string, StateGroup>>((acc, location) => {
    if (!acc[location.state_abbr]) {
      acc[location.state_abbr] = {
        name: location.state,
        abbr: location.state_abbr,
        cities: []
      }
    }
    acc[location.state_abbr].cities.push(location)
    return acc
  }, {})

  // Sort states alphabetically
  const sortedStates = Object.values(stateGroups).sort((a, b) => 
    a.name.localeCompare(b.name)
  )

  // Group states by first letter
  const groupedStates = sortedStates.reduce<Record<string, StateGroup[]>>((acc, state) => {
    const firstLetter = state.name.charAt(0).toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(state)
    return acc
  }, {})

  // Sort the letters
  const sortedLetters = Object.keys(groupedStates).sort()

  // Generate breadcrumbs
  const breadcrumbs = [
    {
      type: 'locations' as const,
      label: 'Locations',
      href: '/locations',
      description: 'Browse all locations'
    }
  ]

  return (
    <main className="flex-1">
      <div className="bg-white border-b">
        <div className="container py-8 space-y-4">
          <Breadcrumbs items={breadcrumbs} className="mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">Browse Locations</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find local businesses across {locations.length.toLocaleString()}+ cities in the United States.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-12">
          {sortedLetters.map((letter) => (
            <div key={letter} id={letter.toLowerCase()} className="scroll-m-20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold text-primary">{letter}</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {groupedStates[letter].map((state) => (
                  <div key={state.abbr} className="space-y-4">
                    {/* State Header */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/locations/${state.abbr.toLowerCase()}`}
                        className="group flex items-center gap-2 hover:text-primary"
                      >
                        <h3 className="text-lg font-semibold">{state.name}</h3>
                        <IconArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <span className="text-sm text-muted-foreground">
                        {state.cities.length} cities
                      </span>
                    </div>

                    {/* Major Cities - Now sorted alphabetically */}
                    <div className="flex flex-wrap gap-2">
                      {state.cities
                        .sort((a, b) => a.city.localeCompare(b.city)) // Sort alphabetically
                        .slice(0, 6)
                        .map((city, index, array) => (
                          <Link
                            key={city.city}
                            href={`/locations/${state.abbr.toLowerCase()}/${city.city.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {city.city}
                            {index !== array.length - 1 && ","}
                            &nbsp;
                          </Link>
                        ))}
                      {state.cities.length > 6 && (
                        <Link
                          href={`/locations/${state.abbr.toLowerCase()}`}
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          +{state.cities.length - 6} more
                        </Link>
                      )}
                    </div>
                  </div>
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
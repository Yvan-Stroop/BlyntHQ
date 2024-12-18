"use client"

import { useState } from "react"
import { 
  IconMapPin, 
  IconBuilding, 
  IconSearch,
  IconArrowRight,
  IconStarFilled,
  IconChevronDown,
  IconUsers
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CategoryLocationsProps {
  category: {
    name: string;
    slug: string;
  };
  locations: Array<{
    city: string;
    state: string;
    state_abbr: string;
  }>;
}

export function CategoryLocations({ category, locations }: CategoryLocationsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllLocations, setShowAllLocations] = useState(false)

  // Group locations by state
  const locationsByState = locations.reduce((acc, location) => {
    if (!acc[location.state]) {
      acc[location.state] = {
        state_abbr: location.state_abbr,
        cities: []
      }
    }
    acc[location.state].cities.push(location.city)
    return acc
  }, {} as Record<string, { state_abbr: string; cities: string[] }>)

  // Sort states by number of cities
  const sortedStates = Object.entries(locationsByState)
    .sort(([, a], [, b]) => b.cities.length - a.cities.length)

  // Filter locations based on search
  const filteredStates = sortedStates.filter(([state]) => 
    state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get featured states (top 4)
  const featuredStates = sortedStates.slice(0, 4)
  // Get remaining states
  const remainingStates = sortedStates.slice(4)

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Find {category.name}s Near You
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Browse {category.name.toLowerCase()}s by location. We've verified businesses across these cities 
          to help you find the best local services.
        </p>
      </div>

      {/* Featured States */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredStates.map(([state, data]) => (
          <Card key={state} className="hover:shadow-lg transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-primary/5 rounded-xl">
                  <IconMapPin className="w-6 h-6 text-primary" stroke={1.5} />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  <IconStarFilled className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{state}</h3>
                <div className="space-y-2">
                  {data.cities.slice(0, 3).map((city) => (
                    <Link
                      key={`${city}-${data.state_abbr}`}
                      href={`/${category.slug}/${data.state_abbr.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <IconBuilding className="w-4 h-4 mr-2" stroke={1.5} />
                      {city}
                    </Link>
                  ))}
                  {data.cities.length > 3 && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-primary p-0 h-auto" 
                      asChild
                    >
                      <Link href={`/${category.slug}/${data.state_abbr.toLowerCase()}`}>
                        +{data.cities.length - 3} more cities
                        <IconArrowRight className="w-3 h-3 ml-1" stroke={1.5} />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <Button className="w-full" variant="outline" asChild>
                <Link href={`/${category.slug}/${data.state_abbr.toLowerCase()}`}>
                  Browse All Cities
                  <IconArrowRight className="w-4 h-4 ml-2" stroke={1.5} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* All Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconMapPin className="w-5 h-5 text-primary" />
              All Locations
            </div>
            <Input
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Visible States */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllLocations ? filteredStates : filteredStates.slice(0, 6)).map(([state, data]) => (
                <div key={state} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{state}</h4>
                    <Badge variant="secondary">
                      <IconUsers className="w-3 h-3 mr-1" />
                      {data.cities.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {data.cities.slice(0, 4).map((city) => (
                      <Link
                        key={`${city}-${data.state_abbr}`}
                        href={`/${category.slug}/${data.state_abbr.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <IconBuilding className="w-4 h-4 mr-2" stroke={1.5} />
                        {city}
                      </Link>
                    ))}
                    {data.cities.length > 4 && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-primary p-0 h-auto" 
                        asChild
                      >
                        <Link href={`/${category.slug}/${data.state_abbr.toLowerCase()}`}>
                          +{data.cities.length - 4} more
                          <IconArrowRight className="w-3 h-3 ml-1" stroke={1.5} />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {filteredStates.length > 6 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAllLocations(!showAllLocations)}
              >
                {showAllLocations ? (
                  <>Show Less</>
                ) : (
                  <>Show All {filteredStates.length} States</>
                )}
                <IconChevronDown 
                  className={cn(
                    "w-4 h-4 ml-2 transition-transform",
                    showAllLocations && "rotate-180"
                  )} 
                  stroke={1.5}
                />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
} 
"use client"

import { 
  IconMapPin, 
  IconBuilding,
  IconArrowRight,
  IconStarFilled,
  IconUsers
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LocationGridProps {
  states: {
    [key: string]: {
      name: string;
      cities: {
        [key: string]: {
          name: string;
        };
      };
    };
  };
}

export function LocationGrid({ states }: LocationGridProps) {
  const statesList = Object.entries(states).map(([stateAbbr, state]) => ({
    abbr: stateAbbr,
    name: state.name,
    cities: Object.entries(state.cities).map(([citySlug, city]) => ({
      slug: citySlug,
      name: city.name
    }))
  }))

  return (
    <section className="py-16 md:py-24">
      <div className="container space-y-8">
        {/* Grid Header */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
            Browse by Location
          </h2>
          <p className="text-muted-foreground text-center">
            Find local businesses in your area
          </p>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statesList.map((state) => (
            <div key={state.abbr} className="group">
              <Card className="h-full hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* State Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/5 rounded-lg">
                          <IconMapPin className="w-5 h-5 text-primary" />
                        </div>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <Link href={`/locations/${state.abbr.toLowerCase()}`}>
                            <h3 className="font-medium">{state.name}</h3>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({state.cities.length} cities)
                            </span>
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Cities List */}
                    <div className="space-y-2">
                      {state.cities.slice(0, 4).map((city) => (
                        <div key={city.slug} className="flex items-center gap-2">
                          <IconBuilding className="w-4 h-4 text-muted-foreground" />
                          <Button variant="link" className="p-0 h-auto" asChild>
                            <Link
                              href={`/locations/${state.abbr.toLowerCase()}/${city.slug.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-sm text-muted-foreground hover:text-primary"
                            >
                              {city.name}
                            </Link>
                          </Button>
                        </div>
                      ))}
                      {state.cities.length > 4 && (
                        <Button variant="link" size="sm" className="mt-2" asChild>
                          <Link href={`/locations/${state.abbr.toLowerCase()}`}>
                            View all {state.cities.length} cities
                            <IconArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
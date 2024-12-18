"use client"

import { useMemo } from "react"
import { 
  IconMapPin,
  IconArrowRight,
  IconBuildingStore,
  IconStarFilled,
  IconTrendingUp
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { normalizeUrlCity } from "@/lib/utils"

interface PopularCity {
  name: string;
  slug: string;
  businessCount: number;
  averageRating: number;
  topBusinesses: string[];
}

interface PopularCitiesProps {
  cities: PopularCity[];
  category: {
    name: string;
    slug: string;
  };
  state: {
    name: string;
    abbr: string;
  };
}

export function PopularCities({
  cities,
  category,
  state
}: PopularCitiesProps) {
  // Memoize base URL to prevent recalculation on each render
  const baseUrl = useMemo(() => 
    `/categories/${category.slug}/${state.abbr.toLowerCase()}`,
    [category.slug, state.abbr]
  )

  // Memoize formatted category name
  const formattedCategoryName = useMemo(() => 
    category.name.toLowerCase(),
    [category.name]
  )

  // Memoize cities with ratings
  const citiesWithRatings = useMemo(() => 
    cities.filter(city => city.averageRating > 0),
    [cities]
  )

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <IconTrendingUp className="w-5 h-5 text-primary" />
          Popular Cities in {state.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          Top locations for {formattedCategoryName} businesses
        </p>
      </div>

      <Separator />

      {/* Cities List */}
      <div className="space-y-4">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`${baseUrl}/${normalizeUrlCity(city.name)}`}
            className="block"
          >
            <div className="group p-4 rounded-lg hover:bg-accent transition-colors">
              <div className="space-y-3">
                {/* City Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                      <IconMapPin className="w-4 h-4" />
                      {city.name}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <IconBuildingStore className="w-4 h-4" />
                        <span>{city.businessCount} businesses</span>
                      </div>
                      {city.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <IconStarFilled className="w-4 h-4 text-yellow-400" />
                          <span>{city.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <IconArrowRight 
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" 
                  />
                </div>

                {/* Top Businesses Preview */}
                {city.topBusinesses.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Featured Businesses:</p>
                    <div className="flex flex-wrap gap-2">
                      {city.topBusinesses.map((business) => (
                        <span 
                          key={business}
                          className="bg-muted px-2 py-1 rounded-md text-xs"
                        >
                          {business}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <Button variant="outline" className="w-full justify-between" asChild>
        <Link href={`/locations/${state.abbr.toLowerCase()}`}>
          View All Cities in {state.name}
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  )
}
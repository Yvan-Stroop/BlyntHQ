"use client"

import { useState } from "react"
import { 
  IconMapPin, 
  IconSearch, 
  IconInfoCircle,
  IconArrowRight,
  IconStarFilled
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { LocationSearch, LocationSearchProps } from "@/components/location-search"
import { cn, normalizeUrlCity } from "@/lib/utils"

interface CategoryHeroProps {
  category: {
    name: string;
    slug: string;
  };
  content: {
    title: string;
    description: string;
    searchTips: string[];
  };
  popularLocations?: Array<{
    city: string;
    state: string;
    state_abbr: string;
    businessCount?: number;
  }>;
  states: LocationSearchProps['states'];
  categories: LocationSearchProps['categories'];
}

export function CategoryHero({ category, content, popularLocations = [], states, categories }: CategoryHeroProps) {
  const [showTips, setShowTips] = useState(false)

  return (
    <section className="relative py-12 md:py-16 lg:py-20 border-b bg-muted/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Category Title */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {content.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {content.description}
            </p>
          </div>

          {/* Search Box */}
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              <LocationSearch 
                states={states}
                categories={categories}
              />

              {/* Search Tips Toggle */}
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => setShowTips(!showTips)}
                >
                  <IconInfoCircle className="w-4 h-4 mr-2" />
                  Search Tips
                </Button>

                {/* Search Tips */}
                {showTips && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
                    <ul className="space-y-2">
                      {content.searchTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <IconStarFilled className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Popular Locations */}
          {popularLocations.length > 0 && (
            <div className="pt-8">
              <div className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap text-sm">
                <span className="font-medium">Popular Areas:</span>
                {popularLocations.slice(0, 5).map((location) => (
                  <Link
                    key={`${location.city}-${location.state_abbr}`}
                    href={`/categories/${category.slug}/${location.state_abbr.toLowerCase()}/${normalizeUrlCity(location.city)}`}
                    className="group"
                  >
                    <Badge variant="secondary" className="gap-1.5">
                      <IconMapPin className="w-3 h-3" />
                      {location.city}, {location.state_abbr}
                      {location.businessCount && (
                        <span className="text-xs text-muted-foreground">
                          ({location.businessCount})
                        </span>
                      )}
                    </Badge>
                  </Link>
                ))}
                {popularLocations.length > 5 && (
                  <Button variant="link" size="sm" className="text-primary" asChild>
                    <Link href={`/categories/${category.slug}/locations`}>
                      View All Locations
                      <IconArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 
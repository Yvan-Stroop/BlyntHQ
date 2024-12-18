"use client"

import { useState, useMemo } from "react"
import { 
  IconMapPin,
  IconBuildingStore,
  IconArrowRight,
  IconSearch
} from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useCallback } from "react"

interface City {
  name: string;
  slug: string;
  businessCount: number;
  averageRating: number;
  topBusinesses?: string[];
}

interface CitiesListProps {
  cities: City[];
  category: {
    name: string;
    slug: string;
  };
  state: {
    name: string;
    abbr: string;
  };
}

export function CitiesList({
  cities,
  category,
  state
}: CitiesListProps) {
  const [search, setSearch] = useState("")

  // Memoize the search handler
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  // Memoize the filter function
  const filterCity = useCallback((city: City) => 
    city.name.toLowerCase().includes(search.toLowerCase()),
    [search]
  )

  // Memoize the URL generator
  const generateCityUrl = useCallback((citySlug: string) => 
    `/categories/${category.slug}/${state.abbr.toLowerCase()}/${citySlug}`,
    [category.slug, state.abbr]
  )

  // Filter and group cities
  const { groupedCities, letters } = useMemo(() => {
    const filteredCities = cities.filter(filterCity)

    const grouped = filteredCities.reduce((acc, city) => {
      const letter = city.name.charAt(0).toUpperCase()
      if (!acc[letter]) {
        acc[letter] = []
      }
      acc[letter].push(city)
      return acc
    }, {} as Record<string, typeof cities>)

    return {
      groupedCities: grouped,
      letters: Object.keys(grouped).sort()
    }
  }, [cities, filterCity])

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={handleSearch}
            placeholder="Search cities..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Cities List */}
      <div className="space-y-8">
        {letters.map((letter) => (
          <div key={letter} id={letter.toLowerCase()} className="scroll-m-20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold text-primary">{letter}</span>
              <Separator className="flex-1" />
            </div>

            <div className="grid gap-y-1">
              {groupedCities[letter].map((city) => (
                <Link
                  key={city.slug}
                  href={generateCityUrl(city.slug)}
                  className="group flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <IconMapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {city.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {city.businessCount} {city.businessCount === 1 ? 'business' : 'businesses'}
                    </span>
                    <IconArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Alphabet Navigation */}
      <div className="sticky bottom-4">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-full p-2 max-w-fit mx-auto shadow-lg">
          <div className="flex flex-wrap justify-center gap-1">
            {letters.map((letter) => (
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
  )
}
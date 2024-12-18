"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"

interface City {
  name: string;
  slug: string;
  businessCount: number;
  averageRating: number;
}

interface State {
  name: string;
  abbr: string;
  totalBusinesses: number;
  averageRating: number;
  cities: City[];
}

interface LocationsProps {
  category: {
    name: string;
    slug: string;
  };
  states: State[];
}

// Helper function to handle category name pluralization
function getPluralCategoryName(name: string): string {
  // Special cases
  const specialCases: { [key: string]: string } = {
    "Company": "Companies",
    "Attorney": "Attorneys",
    "Agency": "Agencies",
    "Factory": "Factories",
    "Business": "Businesses"
  }

  // Check if the name ends with any of our special cases
  for (const [singular, plural] of Object.entries(specialCases)) {
    if (name.endsWith(singular)) {
      return name.replace(new RegExp(`${singular}$`), plural)
    }
  }

  // Default case: just add 's'
  return `${name}s`
}

export function Locations({ category, states }: LocationsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Sort states alphabetically and sort cities within each state
  const sortedStates = [...states].sort((a, b) => a.name.localeCompare(b.name))
    .map(state => ({
      ...state,
      cities: [...state.cities].sort((a, b) => a.name.localeCompare(b.name))
    }))

  // Filter states and cities based on search
  const filteredStates = sortedStates.filter(state => {
    const query = searchQuery.toLowerCase()
    return (
      state.name.toLowerCase().includes(query) ||
      state.cities.some(city => city.name.toLowerCase().includes(query))
    )
  })

  return (
    <section className="py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Find {getPluralCategoryName(category.name)} By Location
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Browse {category.name.toLowerCase()} businesses in cities across the United States
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search states and cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>
      </div>

      {/* States and Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-10 pt-4">
        {filteredStates.map((state) => (
          <div key={state.abbr} className="space-y-4">
            {/* State Name */}
            <h2 className="font-bold text-lg border-b pb-2">
              <Link
                href={`/categories/${category.slug}/${state.abbr.toLowerCase()}`}
                className="hover:text-primary transition-colors"
              >
                {state.name}
              </Link>
            </h2>

            {/* Cities List */}
            <ul className="space-y-2.5 text-sm md:text-base pl-1">
              {state.cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/categories/${category.slug}/${state.abbr.toLowerCase()}/${city.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStates.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No locations found matching your search. Try different keywords or clear your search.
        </p>
      )}
    </section>
  )
} 
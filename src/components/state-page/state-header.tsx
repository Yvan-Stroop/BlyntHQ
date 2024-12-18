"use client"

import { useMemo } from "react"
import { 
  IconMapPin,
  IconBuildingStore
} from "@tabler/icons-react"

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

interface StateHeaderProps {
  category: {
    name: string;
    slug: string;
  };
  state: {
    name: string;
    abbr: string;
  };
  totalCities: number;
  totalBusinesses: number;
}

export function StateHeader({
  category,
  state,
  totalCities,
  totalBusinesses
}: StateHeaderProps) {
  // Memoize the formatted category name
  const formattedCategoryName = useMemo(() => 
    getPluralCategoryName(category.name).toLowerCase(),
    [category.name]
  )

  return (
    <div className="bg-white border-b">
      <div className="container py-12 md:py-16 space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          {getPluralCategoryName(category.name)} in {state.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <IconBuildingStore className="w-4 h-4" />
            <span>{totalBusinesses.toLocaleString()} businesses</span>
          </div>
          <div className="flex items-center gap-2">
            <IconMapPin className="w-4 h-4" />
            <span>Available in {totalCities.toLocaleString()} cities</span>
          </div>
        </div>
      </div>
    </div>
  )
}
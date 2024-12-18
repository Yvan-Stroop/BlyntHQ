"use client"

import { useMemo } from "react"
import { 
  IconBuildingStore,
  IconMapPin,
  IconStarFilled,
  IconUsers,
  IconInfoCircle,
  IconTrendingUp
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface StateInfoProps {
  category: {
    name: string;
    slug: string;
  };
  state: {
    name: string;
    abbr: string;
  };
  statistics: {
    totalBusinesses: number;
    totalCities: number;
    averageRating: number;
    popularCities: string[];
    coveragePercentage: number;
  };
}

export function StateInfo({
  category,
  state,
  statistics
}: StateInfoProps) {
  // Memoize formatted values
  const formattedValues = useMemo(() => ({
    categoryName: category.name.toLowerCase(),
    totalBusinesses: statistics.totalBusinesses.toLocaleString(),
    totalCities: statistics.totalCities.toLocaleString(),
    averageRating: statistics.averageRating.toFixed(1),
    coveragePercentage: Math.round(statistics.coveragePercentage)
  }), [
    category.name,
    statistics.totalBusinesses,
    statistics.totalCities,
    statistics.averageRating,
    statistics.coveragePercentage
  ])

  // Memoize tips list
  const tips = useMemo(() => [
    'Read recent customer reviews',
    'Compare services and pricing',
    'Check business hours and availability',
    'Verify licenses and credentials',
    'Consider the location and travel distance'
  ], [])

  return (
    <div className="space-y-6">
      {/* State Overview */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <IconInfoCircle className="w-5 h-5 text-primary" />
            About {category.name}s in {state.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Find and compare local {formattedValues.categoryName} businesses
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          {/* Business Count */}
          <div className="flex items-start gap-3">
            <IconBuildingStore className="w-4 h-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">{formattedValues.totalBusinesses} Businesses</p>
              <p className="text-sm text-muted-foreground">
                Active {formattedValues.categoryName} businesses in {state.name}
              </p>
            </div>
          </div>

          {/* City Coverage */}
          <div className="flex items-start gap-3">
            <IconMapPin className="w-4 h-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">{formattedValues.totalCities} Cities Covered</p>
              <p className="text-sm text-muted-foreground">
                {formattedValues.coveragePercentage}% coverage across {state.name}
              </p>
            </div>
          </div>

          {/* Average Rating */}
          <div className="flex items-start gap-3">
            <IconStarFilled className="w-4 h-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">{formattedValues.averageRating} Average Rating</p>
              <p className="text-sm text-muted-foreground">
                Based on customer reviews
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Cities */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <IconTrendingUp className="w-5 h-5 text-primary" />
            Popular Cities
          </h2>
          <p className="text-sm text-muted-foreground">
            Top locations for {formattedValues.categoryName} businesses
          </p>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2">
          {statistics.popularCities.map((city) => (
            <Badge 
              key={city}
              variant="secondary"
              className="text-xs"
            >
              {city}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <IconUsers className="w-5 h-5 text-primary" />
            Finding the Right Business
          </h2>
          <p className="text-sm text-muted-foreground">
            Tips for choosing a {formattedValues.categoryName} in {state.name}
          </p>
        </div>

        <Separator />

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>When choosing a {formattedValues.categoryName} in {state.name}, consider:</p>
          <ul className="list-disc list-inside space-y-1">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
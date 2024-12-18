"use client"

import { useMemo } from "react"
import { 
  IconBuildingStore,
  IconMapPin,
  IconStarFilled,
  IconChartBar,
  IconTrendingUp
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface CategoryHeroProps {
  category: {
    name: string;
    slug: string;
    description: string;
  };
  statistics: {
    totalBusinesses: number;
    totalStates: number;
    totalCities: number;
    averageRating: number;
    totalReviews: number;
  };
}

export function CategoryHero({ category, statistics }: CategoryHeroProps) {
  // Memoize formatted values
  const formattedValues = useMemo(() => ({
    categoryName: category.name.toLowerCase(),
    averageRating: statistics.averageRating.toFixed(1),
    coverage: Math.round((statistics.totalCities / statistics.totalStates) * 100)
  }), [category.name, statistics.averageRating, statistics.totalCities, statistics.totalStates])

  return (
    <section className="relative overflow-hidden border-b bg-white">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 4px 4px, black 1px, transparent 0)',
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Content */}
      <div className="container relative py-12 md:py-16 space-y-8">
        {/* Title and Description */}
        <div className="max-w-3xl space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {category.description}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Badge variant="secondary" className="gap-1">
              <IconBuildingStore className="w-3.5 h-3.5" />
              {statistics.totalBusinesses.toLocaleString()} Businesses
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <IconMapPin className="w-3.5 h-3.5" />
              {statistics.totalCities.toLocaleString()} Cities
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <IconStarFilled className="w-3.5 h-3.5 text-yellow-500" />
              {formattedValues.averageRating} Average Rating
            </Badge>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Businesses */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <IconBuildingStore className="w-5 h-5 text-primary" />
                </div>
                <IconTrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold">
                  {statistics.totalBusinesses.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Coverage */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <IconMapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                  {formattedValues.coverage}% Coverage
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Locations</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{statistics.totalCities.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    cities across {statistics.totalStates} states
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Ratings */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <IconStarFilled className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <IconStarFilled 
                      key={i} 
                      className={`w-3 h-3 ${i < Math.round(statistics.averageRating) ? 'opacity-100' : 'opacity-30'}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{formattedValues.averageRating}</p>
                  <p className="text-sm text-muted-foreground">
                    from {statistics.totalReviews.toLocaleString()} reviews
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Trust Indicators */}
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <IconChartBar className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Updated Daily</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated {new Date().toLocaleDateString('en-US', { 
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconStarFilled className="w-4 h-4 text-primary" />
                <span>Verified business data</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
} 
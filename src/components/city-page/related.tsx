"use client"

import { 
  IconCategory,
  IconArrowRight,
  IconTrendingUp,
  IconStarFilled,
  IconBuildingStore
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn, normalizeUrlCity } from "@/lib/utils"

interface RelatedCategoriesProps {
  currentCategory: {
    name: string;
    slug: string;
  };
  city: string;
  state: string;
  relatedCategories: Array<{
    name: string;
    slug: string;
    businessCount?: number;
    averageRating?: number;
  }>;
}

export function RelatedCategories({
  currentCategory,
  city,
  state,
  relatedCategories
}: RelatedCategoriesProps) {
  // Format URL-friendly strings
  const citySlug = normalizeUrlCity(city)
  const stateSlug = state.toLowerCase()

  return (
    <Card className="p-6">
      {/* Section Header */}
      <div className="space-y-1 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <IconCategory className="w-5 h-5 text-primary" />
          Related Categories
        </h2>
        <p className="text-sm text-muted-foreground">
          Similar services in {city}
        </p>
      </div>

      {/* Related Categories List */}
      <div className="space-y-4">
        {relatedCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}/${stateSlug}/${citySlug}`}
            className="block"
          >
            <div className="group p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {category.businessCount && (
                      <div className="flex items-center gap-1">
                        <IconBuildingStore className="w-4 h-4" />
                        <span>{category.businessCount} businesses</span>
                      </div>
                    )}
                    {category.averageRating && (
                      <div className="flex items-center gap-1">
                        <IconStarFilled className="w-4 h-4 text-yellow-400" />
                        <span>{category.averageRating}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <IconArrowRight 
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" 
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular Categories */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
          <IconTrendingUp className="w-4 h-4 text-primary" />
          Popular in {city}
        </h3>

        <div className="flex flex-wrap gap-2">
          {relatedCategories.slice(0, 6).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}/${stateSlug}/${citySlug}`}
            >
              <Badge 
                variant="secondary" 
                className="hover:bg-secondary/80 cursor-pointer"
              >
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Category Comparison */}
      <div className="mt-8 pt-6 border-t space-y-4">
        <h3 className="text-sm font-medium">
          Compare with {currentCategory.name}
        </h3>

        <div className="space-y-3 text-sm">
          {relatedCategories.slice(0, 3).map((category) => (
            <div 
              key={category.slug}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
            >
              <div className="flex items-center gap-4">
                <span>{category.name}</span>
                {category.averageRating && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <IconStarFilled className="w-3 h-3 text-yellow-400" />
                    <span>{category.averageRating}</span>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/categories/${category.slug}/${stateSlug}/${citySlug}`}>
                  Compare
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <div className="mt-6">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/categories">
            View All Categories
            <IconArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </Card>
  )
} 
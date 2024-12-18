"use client"

import Link from "next/link"
import {
  IconBuildingStore,
  IconStarFilled,
  IconChevronRight,
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RelatedCategory {
  name: string;
  slug: string;
  businessCount: number;
  averageRating: number;
}

interface RelatedCategoriesProps {
  currentCategory: {
    name: string;
    slug: string;
  };
  relatedCategories: RelatedCategory[];
}

export function RelatedCategories({ currentCategory, relatedCategories }: RelatedCategoriesProps) {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Similar Services
        </h2>
        <p className="text-muted-foreground">
          Explore other business categories you might be interested in
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {relatedCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group"
          >
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 space-y-4">
                {/* Category Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Category Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {category.businessCount > 0 && (
                    <div className="flex items-center gap-1">
                      <IconBuildingStore className="w-4 h-4" />
                      <span>{category.businessCount} businesses</span>
                    </div>
                  )}
                  {category.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <IconStarFilled className="w-4 h-4 text-yellow-500" />
                      <span>{category.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-primary group-hover:underline">
                    View Category
                  </span>
                  <IconChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
} 
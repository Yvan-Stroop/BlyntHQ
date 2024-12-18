"use client"

import { Category } from "@/lib/csv"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { normalizeUrlCity } from "@/lib/utils"

interface RelatedCategoriesProps {
  currentCategory: Category;
  allCategories: Category[];
  state?: string;
  city?: string;
}

export function RelatedCategories({ 
  currentCategory, 
  allCategories,
  state,
  city
}: RelatedCategoriesProps) {
  // Filter out current category and get related ones
  const relatedCategories = allCategories
    .filter(cat => cat.slug !== currentCategory.slug)
    .slice(0, 6);

  // Generate the correct href based on available location context
  const getCategoryHref = (categorySlug: string) => {
    if (state && city) {
      return `/categories/${categorySlug}/${state.toLowerCase()}/${normalizeUrlCity(city)}`;
    }
    if (state) {
      return `/categories/${categorySlug}/${state.toLowerCase()}`;
    }
    return `/categories/${categorySlug}`;
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Related Categories
        </h2>
        <Button variant="outline" asChild>
          <Link href="/categories">
            View All Categories
            <IconArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedCategories.map((category) => (
          <Card key={category.slug} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <Button variant="link" className="p-0 h-auto w-full text-left" asChild>
                <Link href={getCategoryHref(category.slug)}>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Find local {category.name.toLowerCase()} services
                  </p>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 
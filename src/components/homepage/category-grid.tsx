"use client"

import Link from "next/link"
import { 
  IconCar,
  IconBottle,
  IconShoppingCart,
  IconBarbell,
  IconCurrencyDollar,
  IconRings,
  IconScale,
  IconGavel,
  IconBrush,
  IconScissors,
  IconAirConditioning,
  IconWindow,
  IconStethoscope,
  IconTool,
  IconSparkles,
  IconBuildingFactory,
  IconShieldCheck,
  IconBabyCarriage,
  IconCross,
  IconBuildingBank,
  IconChevronRight,
  IconSearch,
  IconBuilding
} from '@tabler/icons-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Map of category slugs to their icons
const categoryIcons: { [key: string]: any } = {
  'tire-shop': IconCar,
  'liquor-store': IconBottle,
  'supermarket': IconShoppingCart,
  'fitness-center': IconBarbell,
  'dollar-store': IconCurrencyDollar,
  'wedding-venue': IconRings,
  'family-law-attorney': IconScale,
  'general-practice-attorney': IconGavel,
  'gutter-cleaning': IconBrush,
  'hairdresser': IconScissors,
  'ac-repair': IconAirConditioning,
  'window-cleaning': IconWindow,
  'dental-clinic': IconStethoscope,
  'mechanic': IconTool,
  'beauty-salon': IconSparkles,
  'construction': IconBuildingFactory,
  'insurance': IconShieldCheck,
  'baby-store': IconBabyCarriage,
  'funeral-home': IconCross,
  'law-firm': IconBuildingBank
}

interface Category {
  name: string;
  slug: string;
  description?: string;
}

interface CategoryGridProps {
  categories: Category[];
}

function getCategoryIcon(slug: string) {
  return categoryIcons[slug] || IconBuildingBank
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Get top 6 categories for featured section
  const featuredCategories = categories.slice(0, 6)
  // Get next 6 categories for popular section
  const popularCategories = categories.slice(6, 12)
  // Remaining categories
  const remainingCategories = categories.slice(12)

  return (
    <section className="py-16 md:py-24">
      <div className="container space-y-16">
        {/* Featured Categories */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
              Popular Business Categories
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Find the best local businesses in your area across our most searched categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => {
              const Icon = getCategoryIcon(category.slug)
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                          <Icon className="w-8 h-8 text-primary" stroke={1.5} />
                        </div>
                        <div className="flex-1 pt-2">
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            Find local {category.name.toLowerCase()}s
                          </p>
                        </div>
                        <IconChevronRight 
                          className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors mt-3" 
                          stroke={1.5}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Access Categories */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">
            Quick Access Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => {
              const Icon = getCategoryIcon(category.slug)
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:bg-primary/5 transition-colors border-dashed">
                    <CardContent className="p-4 text-center">
                      <Icon 
                        className="w-6 h-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" 
                        stroke={1.5} 
                      />
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Browse All Categories */}
        <Card className="overflow-hidden bg-muted/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-semibold">
                  Browse All Categories
                </h3>
                <p className="text-sm text-muted-foreground">
                  Explore our complete directory of business categories
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 flex-1 md:justify-end">
                {remainingCategories.slice(0, 4).map((category) => {
                  const Icon = getCategoryIcon(category.slug)
                  return (
                    <Button
                      key={category.slug}
                      variant="outline"
                      className="group"
                      asChild
                    >
                      <Link href={`/categories/${category.slug}`}>
                        <Icon 
                          className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" 
                          stroke={1.5} 
                        />
                        {category.name}
                      </Link>
                    </Button>
                  )
                })}
                
                <Button asChild>
                  <Link href="/categories">
                    <IconSearch className="w-4 h-4 mr-2" />
                    View All Categories
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { loadLocationsFromCSV, loadCategoriesFromCSV, Location } from '@/lib/csv'
import { getStateNameFromAbbreviation } from '@/lib/locations'
import { supabase } from '@/lib/supabase'
import { formatLocationName } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { 
  IconMapPin, 
  IconBuilding,
  IconArrowRight,
  IconUsers,
  IconCategory,
  IconStar
} from '@tabler/icons-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

interface PageProps {
  params: Promise<{
    state: string;
    city: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { state, city } = resolvedParams
  const stateName = getStateNameFromAbbreviation(state.toUpperCase())
  const cityName = formatLocationName(city)

  if (!stateName) return notFound()

  const title = `Local Businesses in ${cityName}, ${stateName} - Find Services & Companies`
  const description = `Browse and discover local businesses in ${cityName}, ${stateName}. Find reviews, contact information, and business details for companies in your area.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Blynt'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: `https://getblynt.com/locations/${state.toLowerCase()}/${city.toLowerCase()}`
    }
  }
}

export default async function CityLocationPage({ params }: PageProps) {
  const resolvedParams = await params
  const { state, city } = resolvedParams
  const [locations, categories] = await Promise.all([
    loadLocationsFromCSV(),
    loadCategoriesFromCSV()
  ])
  
  const stateName = getStateNameFromAbbreviation(state.toUpperCase())
  if (!stateName) return notFound()

  const cityName = formatLocationName(city)
  
  // Get all businesses for this city from the database
  const { data: cityBusinesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('state', stateName)
    .ilike('city', cityName.toLowerCase())

  if (!cityBusinesses?.length) {
    return notFound()
  }

  // Group businesses by category
  const categoryMap = new Map<string, {
    category: string;
    slug: string;
    count: number;
    businesses: Array<{
      title: string;
      rating?: number;
      reviews?: number;
    }>;
  }>();

  // Initialize categories from our CSV
  categories.forEach(cat => {
    categoryMap.set(cat.slug, {
      category: cat.name,
      slug: cat.slug,
      count: 0,
      businesses: []
    });
  });

  // Process each business
  cityBusinesses.forEach(business => {
    const processCategory = (categoryName: string) => {
      const matchingCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
      );

      if (matchingCategory && categoryMap.has(matchingCategory.slug)) {
        const categoryData = categoryMap.get(matchingCategory.slug)!;
        // Only increment count and add business if it's not already in the list
        const businessExists = categoryData.businesses.some(b => b.title === business.title);
        if (!businessExists) {
          categoryData.count++;
          categoryData.businesses.push({
            title: business.title,
            rating: business.rating_value,
            reviews: business.rating_count
          });
        }
      }
    };

    // Process main category
    if (business.category) {
      processCategory(business.category);
    }

    // Process additional categories
    const additionalCategories = business.additional_categories as string[] || [];
    additionalCategories.forEach(additionalCat => {
      processCategory(additionalCat);
    });
  });

  // Convert map to array and filter out categories with no businesses
  const activeCategories = Array.from(categoryMap.values())
    .filter(cat => cat.count > 0)
    .map(cat => ({
      ...cat,
      topBusinesses: cat.businesses
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3)
    }))
    .sort((a, b) => b.count - a.count);

  if (!activeCategories.length) {
    return notFound()
  }

  // Generate breadcrumbs
  const breadcrumbs = [
    {
      type: 'locations' as const,
      label: 'Locations',
      href: '/locations',
      description: 'Browse all locations'
    },
    {
      type: 'state' as const,
      label: stateName,
      href: `/locations/${state.toLowerCase()}`,
      description: `Browse businesses in ${stateName}`
    },
    {
      type: 'city' as const,
      label: cityName,
      href: `/locations/${state.toLowerCase()}/${city}`,
      description: `Browse businesses in ${cityName}, ${stateName}`
    }
  ]

  return (
    <main>
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container py-8 space-y-4">
          <Breadcrumbs items={breadcrumbs} className="mb-4" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg">
              <IconMapPin className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Local Businesses in {cityName}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse and discover local businesses across {activeCategories.length} categories in {cityName}, {stateName}.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Popular Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Popular Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategories.map((category) => (
                <Card key={category.slug} className="hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 rounded-lg">
                            <IconCategory className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{category.category}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.count} businesses
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Top Businesses */}
                      <div className="space-y-2">
                        {category.topBusinesses.map((business, index) => (
                          <div key={`${category.slug}-${business.title}-${index}`} className="flex items-center gap-2">
                            <IconBuilding className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {business.title}
                              {business.rating && (
                                <span className="ml-2 flex items-center text-yellow-500">
                                  <IconStar className="w-3 h-3 fill-current" />
                                  <span className="ml-1">{business.rating.toFixed(1)}</span>
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                        <Link href={`/categories/${category.slug}/${state.toLowerCase()}/${city}`}>
                          View All
                          <IconArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadCategoriesFromCSV, loadLocationsFromCSV, transformLocationsToStateCity } from '@/lib/csv'
import { getCategoryDetails } from '@/lib/services/business-search'
import { CategoryInformation } from '@/components/category-pages/category-information'
import { Locations } from '@/components/category-pages/locations'
import { RelatedCategories } from '@/components/category-pages/related-categories'
import { Breadcrumbs } from '@/components/breadcrumbs'
import categoryContent from '@/data/category-content.json'

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const details = await getCategoryDetails(resolvedParams.category)
  
  if (!details) {
    return {
      title: 'Category Not Found',
      description: 'The category you are looking for could not be found.'
    }
  }

  const title = `${details.name} Near Me - Find Local ${details.name} Businesses`
  const description = `Find the best ${details.name.toLowerCase()} businesses near you. Browse reviews, ratings, and business information for local ${details.name.toLowerCase()} services.`
  const canonicalUrl = `https://getblynt.com/categories/${resolvedParams.category.toLowerCase()}`

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
      canonical: canonicalUrl
    }
  }
}

export default async function CategoryRoute({ params }: CategoryPageProps) {
  // Await params first
  const resolvedParams = await params
  
  // Load all required data
  const details = await getCategoryDetails(resolvedParams.category)
  const categories = await loadCategoriesFromCSV()
  const locationData = await loadLocationsFromCSV()
  
  if (!details) {
    notFound()
  }

  // Get content from category-content.json
  const content = (categoryContent as Record<string, any>)[resolvedParams.category]
  if (!content) {
    notFound()
  }

  const category = {
    name: details.name,
    slug: resolvedParams.category,
    description: content.description || `Find reliable ${details.name.toLowerCase()} services in your area.`
  }

  // Use content from JSON file for category information
  const categoryInfo = {
    name: details.name,
    description: content.description,
    services: content.services,
    tips: content.tips,
    faqs: content.faqs
  }

  // Get 4 random categories for the related section (excluding current category)
  const relatedCategoriesData = {
    currentCategory: category,
    relatedCategories: shuffleArray(
      categories.filter(cat => cat.slug !== category.slug)
    )
      .slice(0, 4)
      .map(cat => ({
        name: cat.name,
        slug: cat.slug,
        businessCount: 0,
        averageRating: 0
      }))
  }

  // Transform location data to match the expected State[] type
  const stateData = Object.entries(transformLocationsToStateCity(locationData)).map(([abbr, state]) => ({
    name: state.name,
    abbr,
    totalBusinesses: 0,
    averageRating: 0,
    cities: Object.entries(state.cities).map(([slug, city]) => ({
      name: city.name,
      slug,
      businessCount: 0,
      averageRating: 0
    }))
  }))

  // Generate breadcrumbs
  const breadcrumbs = [
    {
      type: 'categories' as const,
      label: 'Categories',
      href: '/categories',
      description: 'Browse all business categories'
    },
    {
      type: 'category' as const,
      label: details.name,
      href: `/categories/${category.slug}`,
      description: `Find ${details.name.toLowerCase()} businesses`
    }
  ]

  return (
    <main className="min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} className="py-4" />
          <Locations 
            category={category}
            states={stateData}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 space-y-24">
        <CategoryInformation category={categoryInfo} />
        <RelatedCategories {...relatedCategoriesData} />
      </div>
    </main>
  )
}
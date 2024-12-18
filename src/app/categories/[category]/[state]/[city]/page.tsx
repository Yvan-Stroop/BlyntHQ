import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getBusinesses } from '@/lib/services/business'
import { getStateNameFromAbbreviation } from '@/lib/locations'
import { Hero } from '@/components/city-page/hero'
import { Listings } from '@/components/city-page/listings'
import { LocalInfo } from '@/components/city-page/local-info'
import { RelatedCategories } from '@/components/city-page/related'
import { FAQ } from '@/components/city-page/faq'
import { Content } from '@/components/city-page/content'
import { Schema } from '@/components/city-page/schema'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PaginationMeta } from '@/components/pagination-meta'
import { loadCategoriesFromCSV } from '@/lib/csv'
import { formatLocationName, normalizeUrlCity } from '@/lib/utils'
import { BusinessCard } from '@/components/ui/business-card'

interface PageProps {
  params: Promise<{
    category: string;
    state: string;
    city: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  const { category, state, city } = resolvedParams
  const currentPage = resolvedSearchParams?.page ? parseInt(resolvedSearchParams.page) : 1
  
  // Check if URL needs normalization
  const normalizedCity = normalizeUrlCity(city)
  if (city !== normalizedCity) {
    return {
      title: 'Redirecting...',
      description: 'Redirecting to normalized URL'
    }
  }

  const fullStateName = getStateNameFromAbbreviation(state)
  if (!fullStateName) {
    return {
      title: 'Location Not Found',
      description: 'The location you are looking for could not be found.'
    }
  }

  // Get current year
  const currentYear = new Date().getFullYear()

  const title = `TOP 10 BEST ${category} in ${normalizedCity}, ${state.toUpperCase()} - Updated ${currentYear} - Blynt`
  const description = `TOP 10 BEST ${category} in ${normalizedCity}, ${state.toUpperCase()} - Updated ${currentYear} - Blynt`

  // Base canonical URL without pagination
  const baseCanonicalUrl = `https://getblynt.com/categories/${category.toLowerCase()}/${state.toLowerCase()}/${normalizedCity}`
  
  // Add page parameter to canonical URL only for pages > 1
  const canonicalUrl = currentPage > 1 
    ? `${baseCanonicalUrl}?page=${currentPage}`
    : baseCanonicalUrl

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Blynt',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl
    },
    robots: {
      index: currentPage === 1, // Only index the first page
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      nocache: currentPage > 1 // Prevent caching of paginated pages
    }
  }
}

export default async function CategoryCityPage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  const { category, state, city } = resolvedParams
  const currentPage = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1
  
  // Check if URL needs normalization
  const normalizedCity = normalizeUrlCity(city)
  if (city !== normalizedCity) {
    redirect(`/categories/${category}/${state}/${normalizedCity}${resolvedSearchParams.page ? `?page=${resolvedSearchParams.page}` : ''}`)
  }

  const fullStateName = getStateNameFromAbbreviation(state)
  if (!fullStateName) {
    notFound()
  }

  try {
    // Fetch both in parallel
    const [businesses, categories] = await Promise.all([
      getBusinesses({
        category,
        state,
        city,
        page: currentPage
      }),
      loadCategoriesFromCSV()
    ])

    const categoryDetails = categories.find(c => 
      c.slug.toLowerCase() === category.toLowerCase()
    )

    if (!categoryDetails) {
      notFound()
    }

    const mockFaqs = [
      {
        question: `How do I find the best ${category} in ${formatLocationName(normalizedCity)}?`,
        answer: `To find the best ${category} in ${formatLocationName(normalizedCity)}, compare ratings and reviews from local businesses, check their services and prices, and read customer feedback.`
      }
    ]

    const statistics = {
      totalBusinesses: businesses.totalCount,
      exactCount: businesses.exactCount || 0,
      relatedCount: businesses.relatedCount || 0,
      nearbyCount: businesses.nearbyCount || 0,
      averageRating: (businesses as any).averageRating || 0,
      priceRange: (businesses as any).priceRange || '',
      popularAreas: (businesses as any).popularAreas || [],
      totalReviews: (businesses as any).totalReviews || 0,
      coveragePercentage: (businesses as any).coveragePercentage || 0
    }

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
        label: categoryDetails.name,
        href: `/categories/${category}`,
        description: `Find ${categoryDetails.name.toLowerCase()} businesses`
      },
      {
        type: 'state' as const,
        label: fullStateName,
        href: `/categories/${category}/${state.toLowerCase()}`,
        description: `${categoryDetails.name} in ${fullStateName}`
      },
      {
        type: 'city' as const,
        label: formatLocationName(normalizedCity),
        href: `/categories/${category}/${state.toLowerCase()}/${normalizedCity}`,
        description: `${categoryDetails.name} in ${formatLocationName(normalizedCity)}, ${state.toUpperCase()}`
      }
    ]

    return (
      <main>
        <PaginationMeta
          currentPage={businesses.currentPage}
          totalPages={businesses.totalPages}
          baseUrl={`/categories/${category}/${state}/${normalizedCity}`}
        />
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbs} className="py-4" />
        </div>
        <Hero 
          category={categoryDetails}
          city={formatLocationName(normalizedCity)}
          state={fullStateName}
          totalResults={businesses.totalCount}
        />
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-9 space-y-6">
              <Listings 
                businesses={businesses.businesses}
                filters={{
                  category: categoryDetails.name,
                  city: formatLocationName(normalizedCity),
                  state: fullStateName,
                  state_abbr: state.toUpperCase()
                }}
                pagination={{
                  currentPage: businesses.currentPage,
                  totalPages: businesses.totalPages,
                  hasNextPage: businesses.hasNextPage,
                  hasPreviousPage: businesses.hasPreviousPage,
                  baseUrl: `/categories/${category}/${state}/${normalizedCity}`
                }}
              />
            </div>
            <div className="md:col-span-3 space-y-6">
              <LocalInfo
                category={categoryDetails}
                city={formatLocationName(normalizedCity)}
                state={fullStateName}
                statistics={{
                  totalBusinesses: businesses.totalCount,
                  exactCount: businesses.exactCount,
                  relatedCount: businesses.relatedCount,
                  nearbyCount: businesses.nearbyCount,
                  averageRating: statistics.averageRating,
                  priceRange: statistics.priceRange,
                  popularAreas: statistics.popularAreas
                }}
              />
            </div>
          </div>
        </div>

        <div className="container py-8 space-y-8">
          <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted rounded-lg" />}>
            <Content 
              category={categoryDetails}
              city={formatLocationName(normalizedCity)}
              state={fullStateName}
              content={{
                title: `${category} in ${formatLocationName(normalizedCity)}`,
                description: `Find the best ${category.toLowerCase()} services in ${formatLocationName(normalizedCity)}`,
                neighborhoods: statistics.popularAreas,
                specialties: [
                  `Emergency ${categoryDetails.name.toLowerCase()} services`,
                  `Residential ${categoryDetails.name.toLowerCase()} solutions`,
                  `Commercial ${categoryDetails.name.toLowerCase()} services`
                ],
                tips: [
                  {
                    title: "Research and Reviews",
                    content: "Research and read customer reviews to find the best rated businesses"
                  },
                  {
                    title: "Verify Credentials",
                    content: "Verify business credentials and licenses before making a decision"
                  },
                  {
                    title: "Compare Services",
                    content: "Compare service prices and packages between different providers"
                  },
                  {
                    title: "Check Availability",
                    content: "Check availability and response times for your needed services"
                  },
                  {
                    title: "Specific Needs",
                    content: "Ask about specific service needs and requirements"
                  }
                ]
              }}
            />
          </Suspense>
          <Suspense fallback={<div className="h-[200px] animate-pulse bg-muted rounded-lg" />}>
            <FAQ 
              category={categoryDetails}
              city={formatLocationName(normalizedCity)}
              state={fullStateName}
              faqs={mockFaqs}
            />
          </Suspense>
          <Suspense fallback={<div className="h-[200px] animate-pulse bg-muted rounded-lg" />}>
            <RelatedCategories 
              currentCategory={categoryDetails}
              city={formatLocationName(normalizedCity)}
              state={state}
              relatedCategories={categories.filter(c => c.slug !== categoryDetails.slug).map(c => ({
                name: c.name,
                slug: c.slug
              }))}
            />
          </Suspense>
        </div>
        <Schema 
          category={categoryDetails}
          city={formatLocationName(normalizedCity)}
          state={fullStateName}
          businesses={businesses.businesses}
          faqs={mockFaqs}
        />
      </main>
    )
  } catch (error) {
    // If the error is about invalid city, return 404
    if (error instanceof Error && error.message.startsWith('Invalid city:')) {
      notFound()
    }
    console.error('Error in CategoryCityPage:', error)
    throw error
  }
}

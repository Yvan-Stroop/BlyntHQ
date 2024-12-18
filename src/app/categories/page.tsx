import { Metadata } from 'next'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { loadCategoriesFromCSV } from '@/lib/csv'
import { generateCategoryListSchema } from '@/lib/schemas'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Business Categories Directory - Find Local Services & Businesses Near You',
  description: 'Browse our comprehensive directory of business categories to find local services near you. Discover trusted businesses across all industries and categories in your area.',
  keywords: 'business categories, local businesses, business directory, find businesses, local services, US businesses',
  openGraph: {
    title: 'Business Categories Directory - Find Local Services & Businesses Near You',
    description: 'Browse our comprehensive directory of business categories to find local services near you. Discover trusted businesses across all industries and categories in your area.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Blynt',
    url: 'https://getblynt.com/categories'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Categories Directory - Find Local Services & Businesses Near You',
    description: 'Browse our comprehensive directory of business categories to find local services near you.',
  },
  alternates: {
    canonical: 'https://getblynt.com/categories'
  },
  robots: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
}

export default async function CategoriesPage() {
  const categories = await loadCategoriesFromCSV()

  // Generate schema.org structured data
  const schemaData = generateCategoryListSchema({
    categories,
    totalBusinesses: 50000, // Replace with actual count from database
    url: 'https://getblynt.com/categories'
  })

  // Group categories by first letter
  const groupedCategories = categories.reduce((acc, category) => {
    const firstLetter = category.name.charAt(0).toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(category)
    return acc
  }, {} as Record<string, typeof categories>)

  // Sort the letters
  const sortedLetters = Object.keys(groupedCategories).sort()

  // Generate breadcrumbs
  const breadcrumbs = [{
    type: 'categories' as const,
    label: 'Categories',
    href: '/categories',
    description: 'Browse all business categories'
  }]

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="mb-8 h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
        <div className="space-y-8">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="h-8 bg-gray-200 rounded w-1/6 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="p-4 rounded-lg border">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <>
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} className="mb-8" />

          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Find Businesses by Category
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse our comprehensive directory of {categories.length.toLocaleString()}+ business categories 
              to discover trusted local services near you.
            </p>
          </section>

          {/* Alphabetical Categories List */}
          <section className="space-y-8">
            {sortedLetters.map((letter) => (
              <div key={letter} className="scroll-m-20" id={letter.toLowerCase()}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="bg-primary text-primary-foreground w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                    {letter}
                  </span>
                  Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedCategories[letter].map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      className="group p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium group-hover:text-primary">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Find local {category.name.toLowerCase()} services
                          </p>
                        </div>
                        <IconArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Alphabet Quick Navigation */}
          <div className="sticky bottom-4 mt-8">
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-full p-2 max-w-fit mx-auto shadow-lg">
              <div className="flex flex-wrap justify-center gap-1">
                {sortedLetters.map((letter) => (
                  <Button
                    key={letter}
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full"
                    asChild
                  >
                    <a href={`#${letter.toLowerCase()}`}>
                      {letter}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    </Suspense>
  )
}
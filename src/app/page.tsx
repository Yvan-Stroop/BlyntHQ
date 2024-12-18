import { Metadata } from 'next'
import { HeroSection, CategoryGrid, LocationGrid, TrustSignals } from "@/components/homepage"
import { LocationSearch } from "@/components/location-search"
import { loadCategoriesFromCSV, loadLocationsFromCSV, transformLocationsToStateCity } from "@/lib/csv"
import { headers } from 'next/headers'

function getBaseUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  return 'https://getblynt.com'
}

export const metadata: Metadata = {
  title: 'Blynt - Find Local Businesses Near You',
  description: 'Search and discover local businesses across the United States. Find reviews, contact information, and business details in your area.',
  keywords: 'business directory, local businesses, business finder, business search, local services, US businesses',
  openGraph: {
    title: 'Blynt - Find Local Businesses Near You',
    description: 'Search and discover local businesses across the United States. Find reviews, contact information, and business details in your area.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Blynt',
    url: getBaseUrl(),
    images: [
      {
        url: `${getBaseUrl()}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Blynt - Local Business Directory'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blynt - Find Local Businesses Near You',
    description: 'Search and discover local businesses across the United States. Find reviews, contact information, and business details in your area.',
    images: [`${getBaseUrl()}/og-image.jpg`]
  },
  alternates: {
    canonical: getBaseUrl()
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
  },
  other: {
    'revisit-after': '7 days',
    'apple-mobile-web-app-title': 'Blynt',
    'format-detection': 'telephone=no'
  }
}

// Schema.org data for the homepage
function getSchemaData() {
  const baseUrl = getBaseUrl()
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "Blynt",
    "description": "Find local businesses across the United States",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}

export default async function Home() {
  const [categories, locations] = await Promise.all([
    loadCategoriesFromCSV(),
    loadLocationsFromCSV()
  ])

  const states = transformLocationsToStateCity(locations)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchemaData()) }}
      />

      <main>
        <HeroSection 
          locationData={{ states: states }}
          categories={categories}
        />
        <CategoryGrid 
          categories={categories}
        />
        <LocationGrid 
          states={states}
        />
        <TrustSignals />
      </main>
    </>
  )
}

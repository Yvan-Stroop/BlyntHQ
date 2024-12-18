import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Business } from '@/types/business'
import { BreadcrumbPath, BreadcrumbConfig } from '@/types/breadcrumb'
import { 
  BusinessHeader,
  BusinessPhotos,
  LocationAndHours,
  ContactSidebar,
  RelatedBusinesses
} from '@/components/biz-page'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { getBusiness, getRelatedBusinesses } from '@/lib/services/business'
import { normalizeUrlCity, formatLocationName, getStateAbbreviation } from '@/lib/utils'
import { generateBreadcrumbs } from '@/lib/actions'

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// Cache for business data
const businessCache = new Map<string, any>();

// Remove force-dynamic since we're using ISR
export const revalidate = 3600

function formatTitle(business: any) {
  const city = business.address_info?.city || ''
  const state = business.address_info?.region || ''
  
  return `${business.title} - ${business.category} in ${city}, ${state} | Blynt`
}

function formatDescription(business: any) {
  const city = business.address_info?.city || ''
  const state = business.address_info?.region || ''
  const parts = []
  
  parts.push(`${business.title} is a ${business.category.toLowerCase()} located in ${city}, ${state}`)
  
  if (business.rating?.value && business.rating?.votes_count) {
    parts.push(`Rated ${business.rating.value}/5 from ${business.rating.votes_count} reviews`)
  }
  
  if (business.phone) {
    parts.push(`Contact: ${business.phone}`)
  }
  
  if (business.address_info?.address) {
    parts.push(`Visit us at ${business.address_info.address}`)
  }
  
  return parts.join('. ')
}

function generateBreadcrumbSchema(business: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://getblynt.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': business.category,
        'item': `https://getblynt.com/${business.category.toLowerCase()}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `${business.address_info?.city}, ${business.address_info?.region}`,
        'item': `https://getblynt.com/${business.category.toLowerCase()}/${business.address_info?.city?.toLowerCase()}-${business.address_info?.region?.toLowerCase()}`
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': business.title,
        'item': `https://getblynt.com/biz/${business.slug}`
      }
    ]
  }
}

function generateSchemaOrg(business: any) {
  // Create keywords array from category and additional categories
  const keywords = [business.category, ...(business.additional_categories || [])].filter(Boolean)

  // Base schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://getblynt.com/biz/${business.slug}`,
    name: business.title,
    image: business.main_image,
    telephone: business.phone,
    url: `https://getblynt.com/biz/${business.slug}`,
    category: business.category,
    keywords: keywords.join(', '),
    isAccessibleForFree: true,
    areaServed: {
      '@type': 'City',
      name: business.address_info?.city,
      containedInState: {
        '@type': 'State',
        name: business.address_info?.region
      }
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address_info?.address,
      addressLocality: business.address_info?.city,
      addressRegion: business.address_info?.region,
      postalCode: business.address_info?.zip,
      addressCountry: 'US'
    },
    geo: business.latitude && business.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude
    } : undefined,
    ...(business.rating?.value && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: business.rating.value,
        ratingCount: business.rating.votes_count,
        bestRating: '5',
        worstRating: '1'
      }
    }),
    ...(business.price_level && {
      priceRange: ''.padStart(business.price_level, '$')
    }),
    ...(business.phone && {
      potentialAction: {
        '@type': 'PhoneAction',
        target: `tel:${business.phone.replace(/[^\d+]/g, '')}`
      }
    })
  }

  // Only add URL if it exists
  if (business.url) {
    schema.sameAs = [business.url]
  }

  return schema
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  
  // Try to get from cache first
  let business = businessCache.get(slug)
  if (!business) {
    business = await getBusiness(slug)
    if (business) {
      businessCache.set(slug, business)
    }
  }
  
  if (!business) {
    return {
      title: 'Business Not Found',
      description: 'The requested business could not be found.'
    }
  }

  const title = formatTitle(business)
  const description = formatDescription(business)
  
  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `https://getblynt.com/biz/${slug}`
    },
    openGraph: {
      title,
      description,
      images: business.main_image ? [business.main_image] : [],
      type: 'website',
      locale: 'en_US',
      siteName: 'Blynt',
      url: `https://getblynt.com/biz/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: business.main_image ? [business.main_image] : [],
    },
    other: {
      'language': 'en_US',
    }
  }
}

export default async function BusinessPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  
  // Try to get from cache first
  let business = businessCache.get(slug)
  if (!business) {
    business = await getBusiness(slug)
    if (business) {
      businessCache.set(slug, business)
    }
  }

  if (!business) {
    notFound()
  }

  const relatedBusinesses = await getRelatedBusinesses({
    businessId: business.id || '',
    category: business.category || '',
    city: business.address_info?.city || '',
    state: business.address_info?.region || '',
    limit: 8
  })

  // Cast the business and related businesses to the correct type
  const typedBusiness = business as unknown as Business
  const typedRelatedBusinesses = relatedBusinesses as unknown as Business[]

  // Generate breadcrumbs using direct query fields
  const breadcrumbs = await generateBreadcrumbs('business', {
    category: business.query_category,
    state: business.query_state,
    city: business.query_city.trim(),
    business: business.title
  });

  // Generate Schema.org JSON-LD
  const schemaOrg = generateSchemaOrg(business)
  const breadcrumbSchema = generateBreadcrumbSchema(business)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <Breadcrumbs items={breadcrumbs} className="mb-4" showHome={true} homeHref="/" />
          <div className="grid lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 min-w-0">
              <div className="space-y-4 md:space-y-6 lg:space-y-8">
                <BusinessHeader 
                  business={typedBusiness} 
                  category={business.category || ''}
                />
                <BusinessPhotos business={typedBusiness} />
                <LocationAndHours 
                  address={typedBusiness.address_info}
                  hours={typedBusiness.work_hours}
                  coordinates={typedBusiness.latitude && typedBusiness.longitude ? {
                    lat: typedBusiness.latitude,
                    lng: typedBusiness.longitude
                  } : undefined}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 min-w-0">
              <ContactSidebar business={typedBusiness} />
            </div>
          </div>

          <div className="mt-4 md:mt-6 lg:mt-8 min-w-0">
            <RelatedBusinesses 
              business={typedBusiness}
              relatedBusinesses={typedRelatedBusinesses}
              className="mt-4 md:mt-6 lg:mt-8"
            />
          </div>
        </div>
      </main>
    </>
  )
}
import { BASE_URL } from './config'

interface SchemaProps {
    url: string;
    title: string;
    description: string;
    images?: string[];
    datePublished?: string;
    dateModified?: string;
  }
  
  // Global Website Schema
  export const generateGlobalSchema = () => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Blynt",
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/logo.png`,
          "width": "180",
          "height": "60"
        },
        "sameAs": [
          "https://twitter.com/getblynt",
          "https://linkedin.com/company/getblynt"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "support@getblynt.com",
          "url": `${BASE_URL}/contact`
        }
      },
      {
        "@type": "WebSite",
        "url": BASE_URL,
        "name": "Blynt",
        "description": "Find and compare local businesses across the United States",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${BASE_URL}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  })
  
  // State Page Schema
  interface StatePageSchemaProps {
    category: {
      name: string;
      slug: string;
    };
    state: {
      name: string;
      abbr: string;
    };
    cities: Array<{
      name: string;
      slug: string;
      businessCount: number;
      averageRating: number;
      topBusinesses?: string[];
    }>;
    url: string;
  }
  
  export const generateStatePageSchema = ({
    category,
    state,
    cities,
    url
  }: StatePageSchemaProps) => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": `${category.name} in ${state.name}`,
        "description": `Find and compare ${category.name.toLowerCase()} businesses in ${state.name}`,
        "url": url,
        "isPartOf": {
          "@type": "WebSite",
          "url": BASE_URL
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Categories",
              "item": `${BASE_URL}/categories`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": category.name,
              "item": `${BASE_URL}/categories/${category.slug}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": state.name,
              "item": url
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "name": `${category.name} Cities in ${state.name}`,
        "numberOfItems": cities.length,
        "itemListElement": cities.map((city, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "City",
            "name": city.name,
            "url": `${url}/${city.slug}`,
            "containsPlace": {
              "@type": "LocalBusiness",
              "numberOfBusinesses": city.businessCount,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": city.averageRating.toFixed(1),
                "reviewCount": city.businessCount,
                "bestRating": "5",
                "worstRating": "1"
              }
            }
          }
        }))
      },
      {
        "@type": "CollectionPage",
        "name": `${category.name} Businesses in ${state.name}`,
        "description": `Directory of ${category.name.toLowerCase()} businesses in ${state.name}`,
        "about": {
          "@type": "Thing",
          "name": category.name,
          "description": `Local ${category.name.toLowerCase()} services and businesses`
        },
        "specialty": `${category.name} services`,
        "mainContentOfPage": {
          "@type": "WebPageElement",
          "cssSelector": "main"
        },
        "significantLink": cities.map(city => ({
          "@type": "WebPage",
          "name": `${category.name} in ${city.name}`,
          "url": `${url}/${city.slug}`
        }))
      }
    ]
  })
  
  interface CategoryListSchemaProps {
    categories: Array<{ name: string; slug: string }>;
    totalBusinesses: number;
    url: string;
  }
  
  export const generateCategoryListSchema = ({
    categories,
    totalBusinesses,
    url
  }: CategoryListSchemaProps) => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": "Business Categories Directory - Find Local Services & Businesses",
        "description": "Browse our comprehensive directory of business categories to find local services near you.",
        "isPartOf": {
          "@id": "https://getblynt.com/#website"
        },
        "about": {
          "@type": "Thing",
          "name": "Business Categories",
          "description": "Directory of business categories across the United States"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Categories",
              "item": url
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "numberOfItems": categories.length,
        "itemListElement": categories.map((category, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Thing",
            "name": category.name,
            "url": `${url}/${category.slug}`,
            "description": `Find local ${category.name.toLowerCase()} businesses and services`
          }
        }))
      },
      {
        "@type": "Dataset",
        "name": "Blynt Business Categories",
        "description": `Directory of ${categories.length} business categories with ${totalBusinesses} total listings`,
        "keywords": categories.map(c => c.name).join(", "),
        "url": url,
        "provider": {
          "@type": "Organization",
          "@id": "https://getblynt.com/#organization"
        }
      }
    ]
  })
  
  // FAQ Schema
  export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  })
  
  // Business Schema
  export const generateBusinessSchema = (business: {
    title: string;
    description?: string;
    url?: string;
    address: {
      street?: string;
      city: string;
      state: string;
      zip?: string;
    };
    rating?: {
      value: number;
      count: number;
    };
    images?: string[];
    openingHours?: string[];
    priceRange?: string;
    telephone?: string;
    email?: string;
    categories?: string[];
    paymentAccepted?: string[];
    areaServed?: string[];
    amenityFeature?: string[];
    isVerified?: boolean;
  }) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.title,
    "description": business.description,
    "url": business.url,
    "image": business.images,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address.street,
      "addressLocality": business.address.city,
      "addressRegion": business.address.state,
      "postalCode": business.address.zip,
      "addressCountry": "US"
    },
    "telephone": business.telephone,
    "email": business.email,
    "additionalType": business.categories,
    "paymentAccepted": business.paymentAccepted,
    "areaServed": business.areaServed?.map(area => ({
      "@type": "City",
      "name": area
    })),
    "amenityFeature": business.amenityFeature?.map(feature => ({
      "@type": "LocationFeatureSpecification",
      "name": feature
    })),
    "knowsAbout": business.categories,
    "isVerified": business.isVerified,
    ...(business.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": business.rating.value,
        "reviewCount": business.rating.count,
        "bestRating": 5,
        "worstRating": 1
      }
    }),
    ...(business.openingHours && {
      "openingHours": business.openingHours
    }),
    ...(business.priceRange && {
      "priceRange": business.priceRange
    })
  })
  
  // Contact Page Schema
  export const generateContactPageSchema = (url: string) => ({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Blynt",
    "description": "Get in touch with Blynt for support and inquiries",
    "url": url,
    "mainEntity": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@getblynt.com",
      "url": url,
      "availableLanguage": ["English"]
    }
  })
  
  // Add this function
  export const generateHomePageSchema = ({
    categories,
    locations,
    stats
  }: {
    categories: Array<{ name: string; slug: string }>;
    locations: any;
    stats: { value: string; label: string }[];
  }) => ({
    "@context": "https://schema.org",
    "@graph": [
      // Organization Schema (more detailed than global)
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Blynt",
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/logo.png`,
          "width": "180",
          "height": "60"
        },
        "description": "Find and compare local businesses across the United States",
        "sameAs": [
          "https://twitter.com/getblynt",
          "https://linkedin.com/company/getblynt"
        ],
        "areaServed": "US",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": stats[1].value.replace("+", "")
        }
      },
      // WebSite Schema (enhanced)
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": "Blynt",
        "description": "Find local businesses across the United States",
        "publisher": {
          "@id": `${BASE_URL}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${BASE_URL}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      // HomePage Schema
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#webpage`,
        "url": BASE_URL,
        "name": "Blynt - Find Local Businesses Near You",
        "description": "Search and discover local businesses across the United States. Find reviews, contact information, and business details in your area.",
        "isPartOf": {
          "@id": `${BASE_URL}/#website`
        },
        "about": {
          "@id": `${BASE_URL}/#organization`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/og-image.jpg`
        }
      },
      // SiteNavigationElement Schema
      {
        "@type": "SiteNavigationElement",
        "name": "Categories",
        "hasPart": categories.map(category => ({
          "@type": "WebPage",
          "name": category.name,
          "url": `${BASE_URL}/categories/${category.slug}`
        }))
      },
      // ItemList Schema for Categories
      {
        "@type": "ItemList",
        "itemListElement": categories.map((category, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Thing",
            "name": category.name,
            "url": `${BASE_URL}/categories/${category.slug}`
          }
        }))
      }
    ]
  })
  
  // Categories Page Schema
  export const generateCategoriesPageSchema = ({
    categories,
    totalBusinesses,
    url
  }: {
    categories: Array<{ name: string; slug: string }>;
    totalBusinesses: number;
    url: string;
  }) => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": "Business Categories Directory - Find Local Services & Businesses",
        "description": "Browse our comprehensive directory of business categories to find local services near you.",
        "isPartOf": {
          "@id": "https://getblynt.com/#website"
        },
        "about": {
          "@type": "Thing",
          "name": "Business Categories",
          "description": "Directory of business categories across the United States"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Categories",
              "item": url
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "numberOfItems": categories.length,
        "itemListElement": categories.map((category, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Thing",
            "name": category.name,
            "url": `${url}/${category.slug}`,
            "description": `Find local ${category.name.toLowerCase()} businesses and services`
          }
        }))
      },
      {
        "@type": "Dataset",
        "name": "Blynt Business Categories",
        "description": `Directory of ${categories.length} business categories with ${totalBusinesses} total listings`,
        "keywords": categories.map(c => c.name).join(", "),
        "url": url,
        "provider": {
          "@type": "Organization",
          "@id": "https://getblynt.com/#organization"
        }
      }
    ]
  })
  
  interface CategoryPageSchemaProps {
    category: {
      name: string;
      slug: string;
      description: string;
      longDescription?: string;
    };
    services: Array<{
      name: string;
      description: string;
      typicalPrice?: string;
      priceRange?: {
        min: number;
        max: number;
      };
    }>;
    certifications: Array<{
      name: string;
      description: string;
      importance: string;
    }>;
    industryInfo: {
      overview: string;
      considerations: string[];
      regulations?: string[];
    };
    faqs: Array<{
      question: string;
      answer: string;
    }>;
    locations: Array<{
      city: string;
      state: string;
      state_abbr: string;
      businessCount: number;
    }>;
    url: string;
  }
  
  export const generateCategoryPageSchema = ({
    category,
    services,
    certifications,
    industryInfo,
    faqs,
    locations,
    url
  }: CategoryPageSchemaProps) => ({
    "@context": "https://schema.org",
    "@graph": [
      // Main WebPage Schema
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": `${category.name} Services - Find Local ${category.name} Businesses`,
        "description": category.longDescription || category.description,
        "isPartOf": {
          "@id": "https://getblynt.com/#website"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Categories",
              "item": "https://getblynt.com/categories"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": category.name,
              "item": url
            }
          ]
        }
      },
      // Service Category Schema
      {
        "@type": "Service",
        "name": `${category.name} Services`,
        "description": category.description,
        "provider": {
          "@type": "Organization",
          "name": "Blynt"
        },
        "areaServed": locations.map(loc => ({
          "@type": "State",
          "name": loc.state
        })),
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `${category.name} Services`,
          "itemListElement": services.map((service, index) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": service.name,
              "description": service.description,
              ...(service.priceRange && {
                "priceRange": `$${service.priceRange.min} - $${service.priceRange.max}`
              })
            }
          }))
        }
      },
      // FAQ Schema
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      // Professional Service Schema
      {
        "@type": "ProfessionalService",
        "name": category.name,
        "description": category.description,
        "knowsAbout": [
          ...industryInfo.considerations,
          ...(industryInfo.regulations || [])
        ],
        "hasCredential": certifications.map(cert => ({
          "@type": "EducationalOccupationalCredential",
          "name": cert.name,
          "description": cert.description
        }))
      }
    ]
  })
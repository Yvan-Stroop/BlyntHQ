"use client"

import { useMemo } from "react"
import { Business } from "@/types/dataforseo"

interface SchemaProps {
  category: {
    name: string;
    slug: string;
  };
  city: string;
  state: string;
  businesses: Business[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function Schema({
  category,
  city,
  state,
  businesses,
  faqs
}: SchemaProps) {
  // Memoize formatted category names
  const categoryNames = useMemo(() => ({
    base: category.name,
    lower: category.name.toLowerCase(),
    plural: category.name.endsWith('s') ? category.name : `${category.name}s`,
    pluralLower: (category.name.endsWith('s') ? category.name : `${category.name}s`).toLowerCase()
  }), [category.name])

  // Memoize current date strings
  const dates = useMemo(() => {
    const date = new Date()
    return {
      iso: date.toISOString().split('T')[0],
      formatted: date.toLocaleDateString('en-US', { 
        month: 'long',
        year: 'numeric'
      })
    }
  }, [])

  // Memoize business schema data
  const businessSchemaData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": businesses.map((business, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": business.title,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": state
        },
        ...(business.rating && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": business.rating.value,
            "reviewCount": business.rating.votes_count,
            "bestRating": "5",
            "worstRating": "1"
          }
        })
      }
    }))
  }), [businesses, city, state])

  // Memoize FAQ schema data
  const faqSchemaData = useMemo(() => ({
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
  }), [faqs])

  // Memoize article schema data
  const articleSchemaData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${categoryNames.plural} in ${city}, ${state} - Comprehensive Guide`,
    "description": `Find and compare the best ${categoryNames.pluralLower} in ${city}. Learn about services, business hours, and tips for choosing the right provider.`,
    "datePublished": dates.iso,
    "dateModified": dates.iso,
    "author": {
      "@type": "Organization",
      "name": "Blynt"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Blynt",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
      }
    }
  }), [categoryNames, city, state, dates.iso])

  // Create stable schema data using useMemo
  const schemaData = useMemo(() => {
    // Create a stable date string
    const currentDate = new Date().toISOString().split('T')[0] // Use only the date part

    const businessSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": businesses.map((business, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": business.title,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": city,
            "addressRegion": state
          },
          ...(business.rating && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": business.rating.value,
              "reviewCount": business.rating.votes_count,
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }
      }))
    }

    const faqSchema = {
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
    }

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${categoryNames.plural} in ${city}, ${state} - Comprehensive Guide`,
      "description": `Find and compare the best ${categoryNames.pluralLower} in ${city}. Learn about services, business hours, and tips for choosing the right provider.`,
      "datePublished": currentDate,
      "dateModified": currentDate,
      "author": {
        "@type": "Organization",
        "name": "Blynt"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Blynt",
        "logo": {
          "@type": "ImageObject",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
        }
      }
    }

    return {
      businessSchema,
      faqSchema,
      articleSchema
    }
  }, [businesses, categoryNames, city, state, faqs])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.businessSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.faqSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData.articleSchema)
        }}
      />
    </>
  )
} 
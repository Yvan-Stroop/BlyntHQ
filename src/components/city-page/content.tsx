"use client"

import { 
  IconArticle,
  IconMapPin,
  IconBuildingStore,
  IconStarFilled,
  IconInfoCircle,
  IconList,
  IconClock
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ContentProps {
  category: {
    name: string;
    slug: string;
  };
  city: string;
  state: string;
  content?: {
    title?: string;
    description?: string;
    neighborhoods?: string[];
    specialties?: string[];
    tips?: Array<{ title: string; content: string; }>;
  };
}

export function Content({
  category,
  city,
  state,
  content
}: ContentProps) {
  // Format category name for content
  const categoryPlural = category.name.endsWith('s') 
    ? category.name 
    : `${category.name}s`
  const categoryLower = category.name.toLowerCase()
  const categoryPluralLower = categoryPlural.toLowerCase()

  // Default tips if none provided
  const defaultTips = [
    {
      title: `Research and Reviews`,
      content: `Take time to read customer reviews and ratings. Look for ${categoryPluralLower} with consistent positive feedback and professional responses to any concerns.`
    },
    {
      title: `Verify Credentials`,
      content: `Ensure the ${categoryLower} is properly licensed and insured in ${state}. This protects you and ensures professional service standards.`
    },
    {
      title: `Compare Services`,
      content: `Get detailed quotes from multiple ${categoryPluralLower}. Compare their services, pricing, and what's included in their packages.`
    },
    {
      title: `Check Availability`,
      content: `Confirm their service hours and response times. Some ${categoryPluralLower} offer emergency services or extended hours.`
    },
    {
      title: `Location and Service Area`,
      content: `Choose a ${categoryLower} that regularly serves your area in ${city}. This can ensure faster response times and familiarity with local requirements.`
    }
  ]

  return (
    <div className="space-y-8">
      {/* Main Content Section */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="space-y-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <IconArticle className="w-5 h-5 text-primary" />
              About {categoryPlural} in {city}, {state}
            </h2>
            <p className="text-sm text-muted-foreground">
              Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-sm max-w-none">
            <p>
              Finding the right {categoryLower} in {city} can make a significant difference in your experience. 
              Whether you're looking for {content?.specialties?.slice(0, 3).join(', ').toLowerCase()} or other 
              specialized services, {city} offers a diverse range of {categoryPluralLower} to meet your needs.
            </p>

            <h3 className="text-base font-medium mt-6 mb-3 flex items-center gap-2">
              <IconMapPin className="w-4 h-4 text-primary" />
              Local {city} {categoryPlural} Overview
            </h3>
            <p>
              {city}'s {categoryPluralLower} are known for their {[
                'professional service',
                'attention to detail',
                'customer satisfaction',
                'competitive pricing'
              ].join(', ')}. From established businesses to emerging service providers, 
              you'll find options that match your specific requirements and budget.
            </p>
          </div>

          {/* Service Areas */}
          {content?.neighborhoods && content.neighborhoods.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-medium flex items-center gap-2">
                <IconBuildingStore className="w-4 h-4 text-primary" />
                Popular {categoryPlural} by Neighborhood
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.neighborhoods.map((area) => (
                  <Badge key={area} variant="secondary">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Specialties and Services */}
      <Card className="p-6">
        <div className="space-y-6">
          <h3 className="text-base font-medium flex items-center gap-2">
            <IconList className="w-4 h-4 text-primary" />
            Common Services and Specialties
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {(content?.specialties || [
              `Emergency ${categoryLower} services`,
              `Residential ${categoryLower} solutions`,
              `Commercial ${categoryLower} services`,
              `Specialized ${categoryLower} care`,
              `Preventive ${categoryLower} maintenance`,
              `${category.name} consultation services`
            ]).map((specialty, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <IconStarFilled className="w-4 h-4 mt-0.5 text-primary" />
                <span className="text-sm">{specialty}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tips and Guidelines */}
      <Card className="p-6">
        <div className="space-y-6">
          <h3 className="text-base font-medium flex items-center gap-2">
            <IconInfoCircle className="w-4 h-4 text-primary" />
            Tips for Choosing a {category.name} in {city}
          </h3>

          <Accordion type="single" collapsible className="w-full">
            {(content?.tips || defaultTips).map((tip, index) => (
              <AccordionItem key={index} value={`tip-${index}`}>
                <AccordionTrigger className="text-sm hover:no-underline">
                  {tip.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {tip.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Card>

      {/* Business Hours and Availability */}
      <Card className="p-6">
        <div className="space-y-6">
          <h3 className="text-base font-medium flex items-center gap-2">
            <IconClock className="w-4 h-4 text-primary" />
            Typical Business Hours in {city}
          </h3>

          <div className="prose prose-sm max-w-none">
            <p>
              Most {categoryPluralLower} in {city} operate during standard business hours, 
              typically Monday through Friday from 9 AM to 5 PM. However, many businesses 
              offer flexible scheduling and some provide emergency services outside regular hours. 
              We recommend contacting individual businesses directly to confirm their current 
              operating hours and availability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/50">
              <span className="font-medium">Regular Hours:</span>
              <br />
              Mon-Fri: 9:00 AM - 5:00 PM
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <span className="font-medium">Weekend Hours:</span>
              <br />
              Varies by business
            </div>
          </div>
        </div>
      </Card>

      {/* Schema.org Article Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${categoryPlural} in ${city}, ${state} - Comprehensive Guide`,
            "description": `Find and compare the best ${categoryPluralLower} in ${city}. Learn about services, business hours, and tips for choosing the right provider.`,
            "datePublished": new Date().toISOString().split('T')[0],
            "dateModified": new Date().toISOString().split('T')[0],
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
          })
        }}
      />
    </div>
  )
} 
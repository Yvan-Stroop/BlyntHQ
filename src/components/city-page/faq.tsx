"use client"

import { 
  IconHelp,
  IconChevronDown
} from "@tabler/icons-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

interface FAQProps {
  category: {
    name: string;
    slug: string;
  };
  city: string;
  state: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQ({
  category,
  city,
  state,
  faqs
}: FAQProps) {
  // Generate default FAQs if none provided
  const defaultFAQs = [
    {
      question: `What are the best ${category.name}s in ${city}, ${state}?`,
      answer: `The best ${category.name}s in ${city} are ranked based on customer reviews, ratings, and overall service quality. We regularly update our rankings to ensure you have access to the most current information about top-rated ${category.name.toLowerCase()}s in your area.`
    },
    {
      question: `How do I choose a ${category.name} in ${city}?`,
      answer: `When selecting a ${category.name} in ${city}, consider these key factors:\n
      • Read recent customer reviews and ratings\n
      • Compare prices and service packages\n
      • Check business hours and availability\n
      • Verify licenses and insurance\n
      • Look at the business's experience and specializations\n
      • Consider the location and accessibility`
    },
    {
      question: `What's the average cost for a ${category.name} in ${city}?`,
      answer: `The cost of ${category.name.toLowerCase()}s in ${city} varies depending on several factors including service type, location, and experience level. We recommend comparing quotes from multiple providers and reading reviews to ensure you're getting the best value for your money.`
    },
    {
      question: `Are ${category.name}s in ${city} licensed and insured?`,
      answer: `Most ${category.name.toLowerCase()}s in ${city} are required to maintain proper licensing and insurance. However, requirements can vary. We recommend verifying credentials directly with the business and checking local regulations for specific requirements in ${state}.`
    },
    {
      question: `How quickly can I get service from a ${category.name} in ${city}?`,
      answer: `Service availability varies by provider. Many ${category.name.toLowerCase()}s in ${city} offer same-day or next-day service, while others may require advance scheduling. Contact the business directly for their current availability and scheduling options.`
    }
  ]

  const allFAQs = faqs.length > 0 ? faqs : defaultFAQs

  return (
    <Card className="p-6">
      {/* FAQ Header */}
      <div className="space-y-1 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <IconHelp className="w-5 h-5 text-primary" />
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted-foreground">
          Common questions about {category.name.toLowerCase()}s in {city}
        </p>
      </div>

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {allFAQs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground whitespace-pre-line">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  )
} 
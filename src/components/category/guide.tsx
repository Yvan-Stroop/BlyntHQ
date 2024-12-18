"use client"

import { useState } from "react"
import { 
  IconInfoCircle,
  IconCoin,
  IconStarFilled,
  IconChevronRight,
  IconClipboardCheck,
  IconQuestionMark,
  IconChevronDown,
  IconBuildingStore
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface CategoryGuideProps {
  category: {
    name: string;
    slug: string;
  };
  content: {
    commonServices: string[];
    pricingGuide: {
      low: string;
      average: string;
      high: string;
      factors: string[];
    };
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export function CategoryGuide({ category, content }: CategoryGuideProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'pricing' | 'faqs'>('services')

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Complete Guide to Finding {category.name}s
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Everything you need to know about choosing the right {category.name.toLowerCase()}. 
          Compare services, understand pricing, and get answers to common questions.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4">
        <Button
          variant={activeTab === 'services' ? 'default' : 'outline'}
          onClick={() => setActiveTab('services')}
          className="gap-2"
        >
          <IconClipboardCheck className="w-4 h-4" />
          Services
        </Button>
        <Button
          variant={activeTab === 'pricing' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pricing')}
          className="gap-2"
        >
          <IconCoin className="w-4 h-4" />
          Pricing Guide
        </Button>
        <Button
          variant={activeTab === 'faqs' ? 'default' : 'outline'}
          onClick={() => setActiveTab('faqs')}
          className="gap-2"
        >
          <IconQuestionMark className="w-4 h-4" />
          FAQs
        </Button>
      </div>

      {/* Content Sections */}
      <div className="grid gap-6">
        {/* Services Section */}
        <div className={cn(activeTab !== 'services' && 'hidden')}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconClipboardCheck className="w-5 h-5 text-primary" />
                Common Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {content.commonServices.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                  >
                    <IconChevronRight className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">{service}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {/* Service description could be added here */}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Guide Section */}
        <div className={cn(activeTab !== 'pricing' && 'hidden')}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCoin className="w-5 h-5 text-primary" />
                Pricing Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Ranges */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <Badge variant="secondary">Budget-Friendly</Badge>
                  <div className="text-2xl font-bold">{content.pricingGuide.low}</div>
                  <p className="text-sm text-muted-foreground">Basic services</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 space-y-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/15">Average</Badge>
                  <div className="text-2xl font-bold">{content.pricingGuide.average}</div>
                  <p className="text-sm text-muted-foreground">Standard services</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <Badge variant="secondary">Premium</Badge>
                  <div className="text-2xl font-bold">{content.pricingGuide.high}</div>
                  <p className="text-sm text-muted-foreground">Premium services</p>
                </div>
              </div>

              {/* Pricing Factors */}
              <div className="space-y-4">
                <h4 className="font-medium">Factors Affecting Price</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.pricingGuide.factors.map((factor, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                    >
                      <IconInfoCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQs Section */}
        <div className={cn(activeTab !== 'faqs' && 'hidden')}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconQuestionMark className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {content.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 
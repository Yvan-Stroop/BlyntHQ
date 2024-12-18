"use client"

import { useState } from "react"
import {
  IconInfoCircle,
  IconTool,
  IconCoin,
  IconBulb,
  IconChevronDown,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconQuestionMark
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Service {
  name: string;
  priceRange: string;
  description: string;
  timeEstimate?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Tip {
  title: string;
  description: string;
  type: "do" | "dont" | "important";
}

interface CategoryInformationProps {
  category: {
    name: string;
    description: string;
    services: Service[];
    tips: Tip[];
    faqs: FAQ[];
  };
}

export function CategoryInformation({ category }: CategoryInformationProps) {
  const [activeSection, setActiveSection] = useState<string>("description")

  const sections = [
    { id: "description", label: "Overview", icon: IconInfoCircle },
    { id: "services", label: "Services & Pricing", icon: IconCoin },
    { id: "tips", label: "Tips", icon: IconBulb },
    { id: "faqs", label: "FAQs", icon: IconQuestionMark },
  ]

  return (
    <section className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeSection === id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection(id)}
            className="gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Content Sections */}
      <Card className="overflow-hidden">
        <div className="p-6">
          {/* Description Section */}
          {activeSection === "description" && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-semibold">
                    About {category.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Services Section */}
          {activeSection === "services" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Common Services & Price Ranges
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {category.services.map((service, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{service.name}</h3>
                        <Badge variant="secondary">
                          {service.priceRange}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      {service.timeEstimate && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <IconTool className="w-4 h-4" />
                          Typical duration: {service.timeEstimate}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          {activeSection === "tips" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Tips for Choosing a {category.name} Provider
              </h2>
              <div className="grid gap-4">
                {category.tips.map((tip, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      tip.type === "do"
                        ? "bg-green-50 border-green-200"
                        : tip.type === "dont"
                        ? "bg-red-50 border-red-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        rounded-full p-2
                        ${tip.type === "do"
                          ? "bg-green-100 text-green-700"
                          : tip.type === "dont"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }
                      `}>
                        {tip.type === "do" && <IconCheck className="w-4 h-4" />}
                        {tip.type === "dont" && <IconX className="w-4 h-4" />}
                        {tip.type === "important" && <IconAlertCircle className="w-4 h-4" />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">{tip.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Section */}
          {activeSection === "faqs" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {category.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none p-4 rounded-lg hover:bg-accent">
                      <div className="font-medium">{faq.question}</div>
                      <IconChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4 pt-2">
                      <p className="text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </section>
  )
} 
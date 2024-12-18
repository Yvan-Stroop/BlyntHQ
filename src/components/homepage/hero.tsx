"use client"

import Image from "next/image"
import { LocationSearch } from "@/components/location-search"
import { cn } from "@/lib/utils"
import { IconMapPin, IconSearch, IconTrendingUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  locationData: {
    states: {
      [key: string]: {
        name: string;
        cities: {
          [key: string]: {
            name: string;
          };
        };
      };
    };
  };
  categories: Array<{
    name: string;
    slug: string;
  }>;
  className?: string;
}

export function HeroSection({ 
  locationData, 
  categories,
  className 
}: HeroSectionProps) {
  return (
    <section className={cn("relative min-h-[600px] md:min-h-[700px] overflow-hidden bg-background", className)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />

      {/* Main Content */}
      <div className="relative container">
        <div className="flex flex-col items-center justify-center pt-20 pb-16 md:pt-32 md:pb-24">
          {/* Hero Text */}
          <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Find Trusted Local Businesses 
              <span className="text-primary block mt-2">Near You</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with verified local businesses in your area. From restaurants to services, 
              find exactly what you need, when you need it.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-3xl mx-auto mt-12 px-4">
            <div className="bg-card shadow-lg rounded-2xl p-6 md:p-8">
              <LocationSearch 
                states={locationData.states}
                categories={categories}
              />
              
              {/* Popular Searches */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-3">Popular Searches:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 4).map((category) => (
                    <Button
                      key={category.slug}
                      variant="ghost"
                      size="sm"
                      className="bg-primary/5 hover:bg-primary/10 text-primary rounded-full"
                      asChild
                    >
                      <a href={`/categories/${category.slug}`}>
                        <IconSearch className="w-3 h-3 mr-1" />
                        {category.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <IconMapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Local Focus</p>
                <p className="text-muted-foreground">Verified local businesses</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <IconTrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Always Updated</p>
                <p className="text-muted-foreground">Real-time information</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <IconSearch className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Easy to Use</p>
                <p className="text-muted-foreground">Find what you need fast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 
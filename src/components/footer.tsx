"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { IconChevronDown, IconShieldCheck, IconBuildingStore, IconMapPin, IconCategory, IconBrandFacebook, IconBrandInstagram } from "@tabler/icons-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface FooterProps {
  categories?: Array<{
    name: string;
    slug: string;
  }>;
  locations?: Array<{
    city: string;
    state_abbr: string;
  }>;
}

export function Footer({ categories = [], locations = [] }: FooterProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const currentYear = new Date().getFullYear()

  const formatCategoryForSEO = (name: string) => {
    const baseName = name.toLowerCase()
    if (baseName.endsWith('y')) {
      return `${name.slice(0, -1)}ies near me`
    }
    if (baseName.endsWith('s')) {
      return `${name}s near me`
    }
    return `${name}s near me`
  }

  // Group locations by state for better organization
  const groupedLocations = locations.reduce((acc, loc) => {
    if (!acc[loc.state_abbr]) {
      acc[loc.state_abbr] = []
    }
    acc[loc.state_abbr].push(loc)
    return acc
  }, {} as Record<string, typeof locations>)

  return (
    <footer className="bg-muted/30 border-t" aria-label="Site footer">
      {/* Popular Categories Section */}
      <section className="border-b" aria-labelledby="categories-heading">
        <div className="container">
          <Collapsible
            open={categoriesOpen}
            onOpenChange={setCategoriesOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between py-4 hover:bg-muted/50"
                aria-expanded={categoriesOpen}
              >
                <span className="font-medium flex items-center gap-2">
                  <IconCategory className="h-4 w-4" aria-hidden="true" />
                  <span id="categories-heading">Popular Business Categories</span>
                </span>
                <IconChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  categoriesOpen && "rotate-180"
                )} aria-hidden="true" />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="py-8 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-8">
                {categories.map((category) => (
                  <Link 
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title={`Find ${category.name.toLowerCase()} services near you`}
                  >
                    {formatCategoryForSEO(category.name)}
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Updated Company Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-auto">
                <Image
                  src="/images/logo/blynt-logo-main.svg"
                  alt="Blynt"
                  width={180}
                  height={60}
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Blynt helps you discover and connect with local businesses across the United States. 
              Find detailed information, reviews, and contact details for businesses in your area.
            </p>
          </div>

          {/* Popular Locations */}
          <nav className="md:col-span-4" aria-labelledby="locations-heading">
            <h2 id="locations-heading" className="font-semibold mb-4 flex items-center gap-2">
              <IconMapPin className="h-4 w-4" aria-hidden="true" />
              Popular Locations
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(groupedLocations).slice(0, 6).map(([state, cities]) => (
                <div key={state} className="space-y-2">
                  <span className="text-sm font-medium">{state}</span>
                  <ul className="space-y-1">
                    {cities.slice(0, 3).map((location) => (
                      <li key={`${location.city}-${location.state_abbr}`}>
                        <Link 
                          href={`/locations/${location.state_abbr.toLowerCase()}/${location.city.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          title={`Find businesses in ${location.city}, ${location.state_abbr}`}
                        >
                          {location.city}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link 
              href="/locations" 
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-4"
            >
              View all locations
              <IconChevronDown className="h-3 w-3 -rotate-90" aria-hidden="true" />
            </Link>
          </nav>

          {/* Quick Links */}
          <nav className="md:col-span-2" aria-labelledby="quick-links-heading">
            <h2 id="quick-links-heading" className="font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/add-business" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Add Business
                </Link>
              </li>
              <li>
                <Link href="/claim-business" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Claim Business
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal Links */}
          <nav className="md:col-span-2" aria-labelledby="legal-links-heading">
            <h2 id="legal-links-heading" className="font-semibold mb-4">Legal</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap_index.xml" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Links */}
          <nav className="md:col-span-2" aria-labelledby="social-links-heading">
            <h2 id="social-links-heading" className="font-semibold mb-4">Follow Us</h2>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/BlyntHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Follow us on Facebook"
              >
                <IconBrandFacebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/blynthq/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Follow us on Instagram"
              >
                <IconBrandInstagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 sm:order-1">
              <IconShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>© {currentYear} Blynt. All Rights Reserved.</span>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 order-1 sm:order-2">
              <span className="text-xs text-muted-foreground">
                Trusted by businesses across the United States
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Helper function to format numbers
function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}
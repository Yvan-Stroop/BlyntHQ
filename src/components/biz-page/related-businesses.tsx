"use client"

import { Business } from "@/types/business"
import { Button } from "@/components/ui/button"
import { 
  IconArrowRight, 
  IconBuildingStore, 
  IconStar,
  IconChevronRight,
  IconChevronLeft
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { useRef, useState } from "react"

interface RelatedBusinessesProps {
  business: Business;
  relatedBusinesses: Business[];
  searchOrigin?: {
    city: string;
    state: string;
    state_abbr: string;
    category: string;
  };
  className?: string;
}

export function RelatedBusinesses({ business, relatedBusinesses, searchOrigin, className }: RelatedBusinessesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Handle scroll position updates
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      )
    }
  }

  // Scroll handlers
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth * 0.75
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = container.clientWidth * 0.75
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  // Format city name with proper capitalization
  const formattedCity = business.address_info?.city
    ?.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Generate category page URL
  const categorySlug = business.category?.toLowerCase().replace(/\s+/g, '-')
  const citySlug = business.address_info?.city?.toLowerCase().replace(/\s+/g, '-')
  const stateSlug = business.address_info?.state?.toLowerCase()
  const categoryPageUrl = `/categories/${categorySlug}/${stateSlug}/${citySlug}`

  return (
    <section className={cn("border-t", className)}>
      <div className="py-8">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            People Also Viewed
          </h2>
        </div>

        {/* Scrollable Business Cards */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            onScroll={updateScrollButtons}
          >
            {relatedBusinesses.length > 0 ? (
              relatedBusinesses.map((relatedBusiness: Business) => (
                <Link
                  key={relatedBusiness.id}
                  href={`/biz/${relatedBusiness.slug}`}
                  className="flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[calc((100%-3rem)/4.5)] group"
                >
                  <div className="space-y-3">
                    {/* Business Image */}
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                      {relatedBusiness.main_image ? (
                        <Image
                          src={relatedBusiness.main_image}
                          alt={relatedBusiness.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 80vw, (min-width: 769px) 20vw"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <IconBuildingStore className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Business Info */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-base md:text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {relatedBusiness.title}
                      </h3>

                      {/* Rating and Reviews */}
                      {relatedBusiness.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <IconStar
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < Math.floor(relatedBusiness.rating?.value || 0)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {relatedBusiness.rating.votes_count} reviews
                          </span>
                        </div>
                      )}

                      {/* Categories */}
                      {relatedBusiness.category && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {[
                            relatedBusiness.category,
                            ...(relatedBusiness.additional_categories || []).slice(0, 2)
                          ].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground py-8">
                No similar businesses found in this area.
              </p>
            )}
          </div>

          {/* Scroll Buttons - Only on Desktop */}
          {relatedBusinesses.length > 4 && canScrollLeft && (
            <button
              onClick={handleScrollLeft}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 -ml-4 rounded-full bg-background border shadow-sm hover:bg-muted transition-colors"
              aria-label="Scroll left"
            >
              <IconChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          {relatedBusinesses.length > 4 && canScrollRight && (
            <button
              onClick={handleScrollRight}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 -mr-4 rounded-full bg-background border shadow-sm hover:bg-muted transition-colors"
              aria-label="Scroll right"
            >
              <IconChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
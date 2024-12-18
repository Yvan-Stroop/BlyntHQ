"use client"

import { Business } from "@/types/dataforseo"
import { Button } from "@/components/ui/button"
import { 
  IconPhoto, 
  IconPlus, 
  IconChevronLeft, 
  IconChevronRight,
  IconX
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useRef, useState } from "react"

interface BusinessPhotosProps {
  business: Business;
  className?: string;
}

export function BusinessPhotos({ business, className }: BusinessPhotosProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Mock additional photos for placeholder UI
  const placeholderCount = business.main_image ? 3 : 4;

  // Combine main image and placeholder images
  const allImages = [
    ...(business.main_image ? [business.main_image] : []),
    ...Array(placeholderCount).fill('/placeholder-image.jpg')
  ]

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

  // Lightbox navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <>
      <section className={cn("border-t", className)}>
        <div className="py-6 md:py-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Photos & Videos</h2>
            {business.is_claimed ? (
              <Button variant="ghost" size="sm" className="gap-2">
                <IconPhoto className="w-4 h-4" />
                <span className="hidden sm:inline">Add Photos</span>
                <span className="sm:hidden">Add</span>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <IconPhoto className="w-4 h-4" />
                <span className="hidden sm:inline">Verify to Add Photos</span>
                <span className="sm:hidden">Verify</span>
              </Button>
            )}
          </div>

          {/* Photos Grid with Horizontal Scroll */}
          <div className="relative pl-4">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory touch-pan-x"
              onScroll={updateScrollButtons}
            >
              {/* Main Image */}
              {business.main_image && (
                <button
                  onClick={() => {
                    setCurrentImageIndex(0)
                    setLightboxOpen(true)
                  }}
                  className="flex-shrink-0 focus:outline-none snap-start w-[65vw] sm:w-[260px] md:w-[200px]"
                >
                  <div className="relative aspect-[4/3] group">
                    <Image
                      src={business.main_image}
                      alt={`${business.title} main photo`}
                      fill
                      priority
                      className="object-cover rounded-md transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 65vw, (max-width: 768px) 260px, 200px"
                      quality={85}
                    />
                  </div>
                </button>
              )}

              {/* Placeholder Images */}
              {Array.from({ length: placeholderCount }).map((_, index) => (
                <div key={index} className="flex-shrink-0 snap-start w-[65vw] sm:w-[260px] md:w-[200px]">
                  <div className="aspect-[4/3] bg-muted/50 rounded-md flex flex-col items-center justify-center gap-2 border border-dashed">
                    {business.is_claimed ? (
                      <>
                        <IconPlus className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Add Photo</span>
                      </>
                    ) : (
                      <>
                        <IconPhoto className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Verify Business</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Buttons */}
            {canScrollLeft && (
              <button
                onClick={handleScrollLeft}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 -ml-4 rounded-full bg-background border shadow-sm hover:bg-muted transition-colors"
                aria-label="Scroll left"
              >
                <IconChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={handleScrollRight}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 -mr-4 rounded-full bg-background border shadow-sm hover:bg-muted transition-colors"
                aria-label="Scroll right"
              >
                <IconChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Mobile scroll indicator */}
          <p className="mt-2 text-sm text-muted-foreground md:hidden">
            Scroll to see more photos
          </p>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && business.main_image && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <IconX className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative w-full h-full p-8">
              <Image
                src={allImages[currentImageIndex]}
                alt={`${business.title} photo ${currentImageIndex + 1}`}
                fill
                className="object-contain rounded-lg"
                sizes="100vw"
                priority
              />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              aria-label="Previous image"
            >
              <IconChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              aria-label="Next image"
            >
              <IconChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  )
} 
"use client"

import { useState } from "react"
import { Business } from "@/types/dataforseo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { 
  IconStar,
  IconClock,
  IconBuildingStore,
  IconAdjustmentsHorizontal,
  IconLayoutGrid,
  IconList,
  IconCheck,
  IconArrowUp,
  IconArrowDown,
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react"
import { BusinessCard } from "@/components/ui/business-card"

interface ListingsProps {
  businesses: Business[];
  filters: {
    category: string;
    city?: string;
    state?: string;
    state_abbr?: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    baseUrl: string;
  };
}

// Define filter options
const ratingOptions = [4, 3, 2]
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviews', label: 'Number of Reviews' },
  { value: 'distance', label: 'Distance' }
]

interface ActiveFilters {
  rating?: number;
  openNow?: boolean;
  verified?: boolean;
}

// Add this helper function at the top of the file, before the component
function getPageNumbers(currentPage: number, totalPages: number) {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  // Always show first page
  range.push(1);

  // Calculate range around current page
  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }

  // Always show last page
  if (totalPages > 1) {
    range.push(totalPages);
  }

  // Add dots between numbers if needed
  let l;
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

export function Listings({
  businesses,
  filters,
  pagination
}: ListingsProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})
  const [sortBy, setSortBy] = useState<string>('relevance')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const toggleFilter = (type: keyof ActiveFilters, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? undefined : value
    }))
  }

  // Calculate the starting rank for the current page
  const startRank = (pagination.currentPage - 1) * 10 + 1;

  return (
    <div>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => setShowMobileFilters(true)}
        >
          <IconAdjustmentsHorizontal className="w-4 h-4" />
          Filters & Sort
        </Button>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="space-y-6 py-4">
            <h2 className="text-lg font-semibold">Sort by</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Filter by</h2>
              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex flex-col gap-2 mt-2">
                  {ratingOptions.map((rating) => (
                    <Button
                      key={rating}
                      variant={activeFilters.rating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('rating', rating)}
                      className="justify-start gap-2 w-full"
                    >
                      <IconStar className="w-4 h-4" />
                      {rating}+ Stars
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filters */}
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    variant={activeFilters.openNow ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter('openNow', true)}
                    className="justify-start gap-2 w-full"
                  >
                    <IconClock className="w-4 h-4" />
                    Open Now
                  </Button>
                  <Button
                    variant={activeFilters.verified ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter('verified', true)}
                    className="justify-start gap-2 w-full"
                  >
                    <IconBuildingStore className="w-4 h-4" />
                    Verified Business
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="space-y-6 sticky top-4">
            <h2 className="text-lg font-semibold">Sort by</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Filter by</h2>
              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex flex-col gap-2 mt-2">
                  {ratingOptions.map((rating) => (
                    <Button
                      key={rating}
                      variant={activeFilters.rating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter('rating', rating)}
                      className="justify-start gap-2 w-full"
                    >
                      <IconStar className="w-4 h-4" />
                      {rating}+ Stars
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filters */}
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    variant={activeFilters.openNow ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter('openNow', true)}
                    className="justify-start gap-2 w-full"
                  >
                    <IconClock className="w-4 h-4" />
                    Open Now
                  </Button>
                  <Button
                    variant={activeFilters.verified ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter('verified', true)}
                    className="justify-start gap-2 w-full"
                  >
                    <IconBuildingStore className="w-4 h-4" />
                    Verified Business
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {/* Active Filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.rating && (
                <Badge variant="secondary" className="gap-1">
                  <IconStar className="w-3 h-3" />
                  {activeFilters.rating}+ Stars
                </Badge>
              )}
              {activeFilters.openNow && (
                <Badge variant="secondary" className="gap-1">
                  <IconClock className="w-3 h-3" />
                  Open Now
                </Badge>
              )}
              {activeFilters.verified && (
                <Badge variant="secondary" className="gap-1">
                  <IconCheck className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
          )}

          {/* Business Listings */}
          <div className="space-y-4">
            {businesses.map((business, index) => (
              <BusinessCard 
                key={business.place_id}
                business={business}
                rank={startRank + index}
                currentCategory={filters.category}
                searchOrigin={{
                  city: filters.city || '',
                  state: filters.state || '',
                  state_abbr: filters.state_abbr || '',
                  category: filters.category
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center justify-center flex-1 gap-1 overflow-x-auto pb-2 sm:pb-0">
                {pagination.hasPreviousPage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 shrink-0"
                  >
                    <Link href={`${pagination.baseUrl}?page=${pagination.currentPage - 1}`}>
                      <IconChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                
                {getPageNumbers(pagination.currentPage, pagination.totalPages).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.currentPage ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className={cn(
                      "h-8 w-8 p-0 shrink-0",
                      pageNum === pagination.currentPage && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Link href={`${pagination.baseUrl}?page=${pageNum}`}>
                      {pageNum}
                    </Link>
                  </Button>
                ))}

                {pagination.hasNextPage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 shrink-0"
                  >
                    <Link href={`${pagination.baseUrl}?page=${pagination.currentPage + 1}`}>
                      <IconChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>

              {pagination.hasNextPage && (
                <Button
                  asChild
                  className="w-full sm:w-auto shrink-0"
                >
                  <Link href={`${pagination.baseUrl}?page=${pagination.currentPage + 1}`}>
                    Next Page
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
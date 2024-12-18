"use client"

import { useState } from "react"
import { 
  IconStar, 
  IconMapPin, 
  IconPhone,
  IconClock,
  IconBuildingStore,
  IconArrowRight,
  IconStarFilled,
  IconChevronDown,
  IconExternalLink
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { fetchLocalbusiness } from "@/lib/dataforseo"
import { Business } from "@/types/dataforseo"

interface FeaturedBusinessesProps {
  category: {
    name: string;
    slug: string;
  };
  content: {
    title: string;
    description: string;
  };
}

export function FeaturedBusinesses({ category, content }: FeaturedBusinessesProps) {
  const [showAllBusinesses, setShowAllBusinesses] = useState(false)

  // Simulated featured businesses - in production, this would come from DataForSEO
  const featuredBusinesses: Business[] = [
    // This would be populated with actual business data
  ]

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Featured {category.name}s
        </h2>
        <p className="text-muted-foreground max-w-3xl">
          Discover top-rated {category.name.toLowerCase()}s across popular locations. 
          These businesses are verified and highly rated by customers.
        </p>
      </div>

      {/* Featured Grid */}
      <div className="grid gap-6">
        {(showAllBusinesses ? featuredBusinesses : featuredBusinesses.slice(0, 3)).map((business, index) => (
          <Card 
            key={business.place_id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-48 h-48">
                  {business.main_image ? (
                    <Image
                      src={business.main_image}
                      alt={business.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                      <IconBuildingStore className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}
                  {business.is_claimed && (
                    <Badge className="absolute top-2 right-2 bg-background/90">
                      <IconStarFilled className="w-3 h-3 mr-1 text-yellow-400" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {business.title}
                        </h3>
                        {business.rating && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <IconStar className="w-5 h-5 text-yellow-400" fill="currentColor" />
                              <span className="ml-1 font-semibold">
                                {business.rating.value}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({business.rating.votes_count} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary">#{index + 1} Featured</Badge>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      {business.address_info?.address && (
                        <div className="flex items-start gap-2 text-sm">
                          <IconMapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <span>{business.address_info.address}</span>
                        </div>
                      )}
                      {business.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <IconPhone className="w-4 h-4 text-muted-foreground" />
                          <a 
                            href={`tel:${business.phone}`}
                            className="text-primary hover:text-primary/80"
                          >
                            {business.phone}
                          </a>
                        </div>
                      )}
                      {business.work_hours && (
                        <div className="flex items-start gap-2 text-sm">
                          <IconClock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <Badge 
                              variant={business.work_hours.current_status === "open" ? "secondary" : "destructive"}
                              className="mb-1"
                            >
                              {business.work_hours.current_status === "open" ? "Open Now" : "Closed"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {business.url && (
                        <Button size="sm" variant="outline" asChild>
                          <a 
                            href={business.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            Visit Website
                            <IconExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link 
                          href={`/biz/${business.place_id}`}
                          className="flex items-center gap-2"
                        >
                          View Details
                          <IconArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {featuredBusinesses.length > 3 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAllBusinesses(!showAllBusinesses)}
        >
          {showAllBusinesses ? (
            <>Show Less</>
          ) : (
            <>Show All Featured {category.name}s</>
          )}
          <IconChevronDown 
            className={cn(
              "w-4 h-4 ml-2 transition-transform",
              showAllBusinesses && "rotate-180"
            )} 
            stroke={1.5}
          />
        </Button>
      )}

      {/* Call to Action */}
      <Card className="bg-primary-50 dark:bg-primary-950/50 border-0">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-semibold">
                Own a {category.name} Business?
              </h3>
              <p className="text-sm text-muted-foreground">
                Get featured in our directory and reach more customers in your area.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/claim-business">
                  Claim Your Business
                </Link>
              </Button>
              <Button asChild>
                <Link href="/add-business">
                  Add Your Business
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
} 
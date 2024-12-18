"use client"

import { 
  IconMapPin, 
  IconStar, 
  IconCreditCard,
  IconUsers,
  IconBuildingStore,
  IconInfoCircle,
  IconChevronRight
} from "@tabler/icons-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LocalInfoProps {
  category: {
    name: string;
    slug: string;
  };
  city: string;
  state: string;
  statistics: {
    totalBusinesses: number;
    exactCount: number;
    relatedCount: number;
    nearbyCount: number;
    averageRating: number;
    priceRange: string;
    popularAreas?: string[];
  };
}

export function LocalInfo({
  category,
  city,
  state,
  statistics
}: LocalInfoProps) {
  return (
    <section className="container py-8 md:py-12">
      <div className="space-y-6">
        {/* Local Statistics */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IconInfoCircle className="w-5 h-5 text-primary" />
            About {category.name}s in {city}
          </h2>

          <div className="space-y-4">
            {/* Business Count */}
            <div className="flex items-start gap-3">
              <IconBuildingStore className="w-4 h-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">{statistics.totalBusinesses} Businesses</p>
                <p className="text-sm text-muted-foreground">
                  Active {category.name.toLowerCase()}s in {city}
                </p>
              </div>
            </div>

            {/* Average Rating */}
            <div className="flex items-start gap-3">
              <IconStar className="w-4 h-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">{Number(statistics.averageRating).toFixed(1)} Average Rating</p>
                <p className="text-sm text-muted-foreground">
                  Based on customer reviews
                </p>
              </div>
            </div>

            {/* Price Range */}
            <div className="flex items-start gap-3">
              <IconCreditCard className="w-4 h-4 mt-1 text-muted-foreground" />
              <div>
                <p className="font-medium">Typical Price Range</p>
                <div className="flex gap-2 mt-1">
                  {statistics.priceRange.split('').map((price, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="text-xs"
                    >
                      {price}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Popular Areas */}
        {statistics.popularAreas && statistics.popularAreas.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <IconMapPin className="w-5 h-5 text-primary" />
              Popular Areas
            </h2>

            <div className="space-y-3">
              {statistics.popularAreas.map((area) => (
                <div 
                  key={area}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-sm">{area}</span>
                  <IconChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Local Tips */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IconUsers className="w-5 h-5 text-primary" />
            Local Tips
          </h2>

          <div className="prose prose-sm">
            <p>
              When choosing a {category.name.toLowerCase()} in {city}, consider:
            </p>
            <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
              <li>Check recent customer reviews</li>
              <li>Compare pricing across different providers</li>
              <li>Look for businesses in your preferred area</li>
              <li>Verify business hours and availability</li>
              <li>Ask about specific services you need</li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  )
} 
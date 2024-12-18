import { 
  IconMapPin, 
  IconBuilding,
  IconArrowRight,
  IconStarFilled,
  IconUsers,
  IconChevronRight,
  IconBuildingStore
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn, normalizeUrlCity } from "@/lib/utils"

interface LocationCardProps {
  location: {
    city: string;
    state: string;
    state_abbr: string;
    businessCount?: number;
    population?: number;
    featured?: boolean;
    topCategories?: Array<{
      name: string;
      slug: string;
      count: number;
    }>;
  };
  variant?: 'default' | 'compact' | 'featured';
  showStats?: boolean;
  showCategories?: boolean;
  className?: string;
}

export function LocationCard({ 
  location, 
  variant = 'default',
  showStats = true,
  showCategories = true,
  className 
}: LocationCardProps) {
  const citySlug = normalizeUrlCity(location.city);
  const stateSlug = location.state_abbr.toLowerCase();
  const locationUrl = `/${stateSlug}/${citySlug}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${process.env.NEXT_PUBLIC_SITE_URL}${locationUrl}`,
    "name": `${location.city}, ${location.state}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.city,
      "addressRegion": location.state_abbr,
      "addressCountry": "US"
    },
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}${locationUrl}`,
    ...(location.businessCount && {
      "amenityFeature": {
        "@type": "LocationFeatureSpecification",
        "name": "Listed Businesses",
        "value": location.businessCount
      }
    }),
    ...(location.population && {
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "Population",
        "value": location.population
      }
    })
  };

  if (variant === 'compact') {
    return (
      <Link href={locationUrl} className="group">
        <Card className="hover:bg-primary/5 transition-colors border-dashed h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-background rounded-lg">
                <IconMapPin 
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" 
                  stroke={1.5} 
                />
              </div>
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {location.city}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {location.state}
                  {location.businessCount && ` • ${location.businessCount} businesses`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <Link href={locationUrl} className="group">
        <Card 
          className={cn(
            "h-full hover:shadow-lg transition-all duration-300 relative overflow-hidden",
            location.featured && "border-primary/20 bg-primary/5",
            className
          )}
        >
          <CardContent className="pt-6">
            {location.featured && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                  <IconStarFilled className="w-3 h-3 mr-1" />
                  Featured Location
                </Badge>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-3 bg-primary/5 rounded-xl w-fit">
                <IconMapPin className="w-8 h-8 text-primary" stroke={1.5} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {location.city}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {location.state} ({location.state_abbr})
                </p>
              </div>

              {showStats && (
                <div className="flex items-center gap-4 text-sm">
                  {location.businessCount && (
                    <div className="flex items-center gap-1.5">
                      <IconBuildingStore className="w-4 h-4 text-muted-foreground" stroke={1.5} />
                      <span>{location.businessCount} businesses</span>
                    </div>
                  )}
                  {location.population && (
                    <div className="flex items-center gap-1.5">
                      <IconUsers className="w-4 h-4 text-muted-foreground" stroke={1.5} />
                      <span>{new Intl.NumberFormat().format(location.population)} residents</span>
                    </div>
                  )}
                </div>
              )}

              {showCategories && location.topCategories && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Popular Categories</h4>
                  <div className="space-y-2">
                    {location.topCategories.slice(0, 3).map((category) => (
                      <Link
                        key={category.slug}
                        href={`${locationUrl}/${category.slug}`}
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <IconBuilding className="w-4 h-4 mr-2" stroke={1.5} />
                        {category.name}
                        <span className="text-xs ml-auto">
                          {category.count} businesses
                        </span>
                      </Link>
                    ))}
                  </div>
                  {location.topCategories.length > 3 && (
                    <p className="text-sm text-primary flex items-center pt-1">
                      +{location.topCategories.length - 3} more categories
                      <IconChevronRight className="w-4 h-4 ml-1" stroke={1.5} />
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="font-medium group-hover:text-primary transition-colors">
                  View Location
                </span>
                <IconArrowRight 
                  className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" 
                  stroke={1.5} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}
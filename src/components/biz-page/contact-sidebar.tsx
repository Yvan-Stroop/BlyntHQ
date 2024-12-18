"use client"

import { Business } from "@/types/dataforseo"
import { Button } from "@/components/ui/button"
import { 
  IconPhone,
  IconMapPin,
  IconExternalLink,
  IconBuildingStore,
  IconPencil,
  IconMessage
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { formatPhoneNumber } from "@/lib/utils"

interface ContactSidebarProps {
  business: Business;
  className?: string;
}

export function ContactSidebar({ business, className }: ContactSidebarProps) {
  const formattedPhone = formatPhoneNumber(business.phone || '')

  // Handle click tracking
  const handleContactClick = (method: 'phone' | 'directions' | 'website' | 'message') => {
    console.log(`Contact click: ${method}`)
  }

  return (
    <div 
      className={cn(
        "lg:sticky lg:top-8",
        "rounded-lg border bg-card p-6",
        "w-full max-w-full lg:max-w-sm",
        className
      )}
    >
      {/* Primary Actions */}
      <div className="space-y-4">
        {/* Message Business */}
        <Button 
          className="w-full gap-2 text-base"
          size="lg"
          onClick={() => handleContactClick('message')}
        >
          <IconMessage className="w-5 h-5" />
          Contact Business
        </Button>

        {/* Call Now */}
        {business.phone && (
          <Button 
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleContactClick('phone')}
            asChild
          >
            <a href={`tel:${business.phone}`}>
              <IconPhone className="w-4 h-4" />
              {formattedPhone || "Call Now"}
            </a>
          </Button>
        )}
      </div>

      {/* Business Info */}
      <div className="mt-6 space-y-4 pt-6 border-t">
        {/* Business Name */}
        <div className="flex items-start gap-3">
          <IconBuildingStore className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">{business.title}</h3>
            {business.category && (
              <p className="text-sm text-muted-foreground">{business.category}</p>
            )}
          </div>
        </div>

        {/* Website */}
        {business.url && (
          <div className="flex items-start gap-3">
            <IconExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <a 
              href={business.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              onClick={() => handleContactClick('website')}
            >
              Visit website
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        )}

        {/* Phone */}
        {formattedPhone && (
          <div className="flex items-start gap-3">
            <IconPhone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <a 
              href={`tel:${business.phone}`}
              className="text-sm hover:underline"
              onClick={() => handleContactClick('phone')}
            >
              {formattedPhone}
            </a>
          </div>
        )}

        {/* Address */}
        {business.address_info && (
          <div className="flex items-start gap-3">
            <IconMapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p>{business.address_info.address}</p>
              <p className="text-muted-foreground">
                {business.address_info.city}, {business.address_info.region} {business.address_info.zip}
              </p>
              {business.latitude && business.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 hover:underline"
                  onClick={() => handleContactClick('directions')}
                >
                  Get directions
                  <IconExternalLink className="w-3 h-3 inline ml-1" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Suggest Edit Link - Updated styling */}
      <div className="mt-6 pt-6 border-t">
        <Button 
          variant="outline" 
          className="w-full gap-2 hover:bg-muted/80 transition-colors"
          size="sm"
        >
          <IconPencil className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Suggest an edit</span>
        </Button>
      </div>

      {/* Mobile View - Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="flex gap-3">
          {business.phone && (
            <Button 
              className="flex-1 gap-2"
              onClick={() => handleContactClick('phone')}
              asChild
            >
              <a href={`tel:${business.phone}`}>
                <IconPhone className="w-4 h-4" />
                Call
              </a>
            </Button>
          )}
          <Button 
            className="flex-1 gap-2"
            onClick={() => handleContactClick('message')}
          >
            <IconMessage className="w-4 h-4" />
            Message
          </Button>
        </div>
      </div>
    </div>
  )
}
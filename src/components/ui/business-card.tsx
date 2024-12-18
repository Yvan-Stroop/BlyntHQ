"use client"

import { Business } from "@/types/business"
import { Business as DataForSEOBusiness } from "@/types/dataforseo"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  IconStar, 
  IconMapPin, 
  IconStarFilled,
  IconExternalLink,
  IconShieldCheck,
  IconBuildingStore,
  IconArrowRight,
  IconCategory,
  IconClock,
  IconPhone
} from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { cn, formatPhoneNumber, getTimezoneFromState } from "@/lib/utils"

type CombinedBusiness = Partial<Business> & DataForSEOBusiness;

interface BusinessCardProps {
  business: CombinedBusiness;
  rank?: number;
  showMap?: boolean;
  currentCategory?: string;
  searchOrigin?: {
    city: string;
    state: string;
    state_abbr: string;
    category: string;
  };
}

function getBusinessHoursText(workHours: DataForSEOBusiness['work_hours'], state?: string) {
  if (!workHours?.timetable || !state) return null;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Get timezone for the business's state
  const timezone = getTimezoneFromState(state);
  
  // Get current time in business's timezone
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    weekday: 'long'
  };
  
  const [time, weekday] = new Intl.DateTimeFormat('en-US', options)
    .format(now)
    .split(' ')
    .reverse();
  
  const [hours24, minutes] = time.split(':').map(Number);
  const currentDay = weekday.toLowerCase();
  const currentTimeInMinutes = (hours24 * 60) + minutes;

  // Check if it's a 24-hour business
  const is24Hours = Object.values(workHours.timetable).every(daySchedule => 
    daySchedule?.every(schedule => 
      schedule.open.hour === 0 && 
      schedule.open.minute === 0 && 
      schedule.close.hour === 0 && 
      schedule.close.minute === 0
    )
  );

  if (is24Hours) {
    return {
      isOpen: true,
      text: " · 24/7"
    };
  }

  // Format time function
  const formatTime = (time: { hour: number; minute: number }) => {
    const period = time.hour >= 12 ? 'PM' : 'AM';
    const hour12 = time.hour % 12 || 12;
    return `${hour12}:${time.minute.toString().padStart(2, '0')} ${period}`;
  };

  // Get today's schedule
  const todaySchedule = workHours.timetable[currentDay];
  
  if (!todaySchedule || todaySchedule.length === 0) {
    // Find next opening
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (new Date(now).getDay() + i) % 7;
      const nextDay = days[nextDayIndex];
      const nextDaySchedule = workHours.timetable[nextDay];
      
      if (nextDaySchedule && nextDaySchedule.length > 0) {
        const nextDayName = nextDay.charAt(0).toUpperCase() + nextDay.slice(1);
        return {
          isOpen: false,
          text: ` · Opens ${nextDayName} at ${formatTime(nextDaySchedule[0].open)}`
        };
      }
    }
    return {
      isOpen: false,
      text: " · Temporarily closed"
    };
  }

  // Handle current day schedule
  const slot = todaySchedule[0];
  const openTimeInMinutes = (slot.open.hour * 60) + slot.open.minute;
  const closeTimeInMinutes = (slot.close.hour * 60) + slot.close.minute;

  // Check if currently open
  const isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;

  if (isOpen) {
    if (slot.open.hour === 0 && slot.open.minute === 0 && 
        slot.close.hour === 0 && slot.close.minute === 0) {
      return {
        isOpen: true,
        text: " · 24/7"
      };
    }
    return {
      isOpen: true,
      text: ` · ${formatTime(slot.open)} - ${formatTime(slot.close)}`
    };
  } else {
    return {
      isOpen: false,
      text: ` · Opens at ${formatTime(slot.open)}`
    };
  }
}

export function BusinessCard({ business, rank, showMap = false, currentCategory, searchOrigin }: BusinessCardProps) {
  const hoursInfo = business.work_hours ? getBusinessHoursText(business.work_hours, business.state || business.address_info?.state) : null;
  const isOpen = hoursInfo?.isOpen;

  // Build the URL without search origin parameters
  const businessUrl = `/biz/${business.slug || `${business.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(business.address_info?.city || business.city)?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}`

  // Filter and sort categories
  const categories = [
    currentCategory || business.category,
    ...(business.additional_categories || [])
      .filter(cat => {
        const normalizedCat = cat.toLowerCase();
        const normalizedCurrentCat = (currentCategory || '').toLowerCase();
        const normalizedMainCat = (business.category || '').toLowerCase();
        return normalizedCat !== normalizedCurrentCat && normalizedCat !== normalizedMainCat;
      })
  ]
    .filter((cat): cat is string => typeof cat === 'string')
    .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase())
    .slice(0, 3);

  // Format full address
  const fullAddress = [
    business.address_info?.address || business.address_street,
    business.address_info?.city || business.city,
    business.address_info?.region || business.state
  ].filter(Boolean).join(', ')

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow">
      <Link 
        href={businessUrl}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${business.title}`}
      />
      
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Section */}
          <div className="relative w-full md:w-40 h-40 flex-shrink-0">
            {business.main_image ? (
              <Image
                src={business.main_image}
                alt={business.title}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 160px"
              />
            ) : (
              <div className="w-full h-full bg-muted/50 rounded-md flex items-center justify-center">
                <IconBuildingStore className="w-12 h-12 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Top Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-primary font-medium">
                    {rank && `${rank}.`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold leading-tight">
                      {business.title}
                    </h3>
                  </div>
                </div>

                {/* Verified Badge */}
                {business.is_claimed && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800">
                    <IconShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified Business
                  </Badge>
                )}
                
                {/* Rating */}
                {business.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <IconStar
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(business.rating?.value || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({business.rating.votes_count} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Categories with Icon */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <IconCategory className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Status */}
              {business.work_hours && hoursInfo && (
                <div className="flex items-start gap-2">
                  <IconClock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className={cn(
                      "font-medium",
                      isOpen ? "text-emerald-500" : "text-destructive"
                    )}>
                      {isOpen ? "Open" : "Closed"}
                    </span>
                    <span className="text-muted-foreground">
                      {hoursInfo.text.split('·')[1]}
                    </span>
                  </p>
                </div>
              )}

              {/* Full Address */}
              {fullAddress && (
                <div className="flex items-start gap-2">
                  <IconMapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {fullAddress}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t" />

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {business.url && (
              <Button 
                size="sm" 
                variant="outline" 
                className="relative z-30" 
                asChild
              >
                <a 
                  href={business.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  Visit Website
                  <IconExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
            {business.latitude && business.longitude && (
              <Button 
                size="sm" 
                variant="outline" 
                className="relative z-30" 
                asChild
              >
                <a 
                  href={`https://www.google.com/maps?q=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  View on Map
                  <IconMapPin className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
          <Link 
            href={businessUrl}
            className="relative z-20"
          >
            <Button 
              size="sm" 
              variant="outline" 
              className="group-hover:bg-primary/5"
            >
              View Details
              <IconArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

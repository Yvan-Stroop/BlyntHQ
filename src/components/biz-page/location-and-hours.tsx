"use client"

import { LocationAndHoursProps } from './types'
import { Button } from "@/components/ui/button"
import { 
  IconMapPin, 
  IconClock, 
  IconExternalLink,
  IconPencil
} from "@tabler/icons-react"
import { cn, getTimezoneFromState } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"
import type { BusinessHours } from '@/types/dataforseo'

// Add ordered days array
const orderedDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

export function LocationAndHours({ 
  address, 
  hours, 
  coordinates,
  className 
}: LocationAndHoursProps) {
  const [currentDay, setCurrentDay] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [formattedTimes, setFormattedTimes] = useState<{[key: string]: string}>({})
  const [mounted, setMounted] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // Handle mounting state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lazy load map when it comes into view
  useEffect(() => {
    if (!mapRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

  // Move all time-sensitive operations to useEffect
  useEffect(() => {
    if (!mounted || !address?.state) return;

    // Get timezone for the business's state
    const timezone = getTimezoneFromState(address.state)
    
    // Get current time in business's timezone
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      weekday: 'long'
    }
    
    const [time, weekday] = new Intl.DateTimeFormat('en-US', options)
      .format(now)
      .split(' ')
      .reverse()
    
    const [hours24, minutes] = time.split(':').map(Number)
    const currentDayName = weekday.toLowerCase()
    
    setCurrentDay(currentDayName)
    
    // Check if business is open
    if (hours?.timetable && hours.timetable[currentDayName]) {
      const todaySlots = hours.timetable[currentDayName]
      if (todaySlots && todaySlots.length > 0) {
        const slot = todaySlots[0] // Using first slot for now
        
        // Convert current time to minutes for easier comparison
        const currentTimeInMinutes = (hours24 * 60) + minutes
        const openTimeInMinutes = (slot.open.hour * 60) + slot.open.minute
        const closeTimeInMinutes = (slot.close.hour * 60) + slot.close.minute

        const isCurrentlyOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes
        console.log('Time debug:', {
          timezone,
          currentDay: currentDayName,
          currentTime: `${hours24}:${minutes}`,
          openTime: `${slot.open.hour}:${slot.open.minute}`,
          closeTime: `${slot.close.hour}:${slot.close.minute}`,
          currentTimeInMinutes,
          openTimeInMinutes,
          closeTimeInMinutes,
          isOpen: isCurrentlyOpen
        })
        setIsOpen(isCurrentlyOpen)
      } else {
        setIsOpen(false)
      }
    }

    // Pre-format all times to avoid hydration mismatches
    if (hours?.timetable) {
      const times: {[key: string]: string} = {}
      Object.entries(hours.timetable).forEach(([day, slots]) => {
        if (slots && slots.length > 0) {
          times[day] = slots.map(slot => {
            const openTime = new Date(0, 0, 0, slot.open.hour, slot.open.minute)
              .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            const closeTime = new Date(0, 0, 0, slot.close.hour, slot.close.minute)
              .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            return `${openTime} - ${closeTime}`
          }).join(', ')
        }
      })
      setFormattedTimes(times)
    }
  }, [hours, mounted, address?.state])

  // Update the maps URL generation
  const mapsUrl = coordinates?.lat && coordinates?.lng
    ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    : address ? `https://www.google.com/maps/search/${encodeURIComponent(
        `${address.address}, ${address.city}, ${address.state}`
      )}` : '';

  return (
    <section className={cn("border-t", className)}>
      <div className="py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Location & Hours</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <IconPencil className="w-4 h-4" />
            Suggest an edit
          </Button>
        </div>

        {/* Main Content Grid */}
        <div id="hours-section" className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Map and Address */}
          <div className="space-y-4 md:space-y-6">
            {/* Map */}
            {(coordinates?.lat && coordinates?.lng) && (
              <div 
                ref={mapRef}
                className="relative w-full rounded-lg overflow-hidden border bg-muted"
                style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
              >
                <div className="absolute inset-0">
                  {showMap ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${coordinates.lat},${coordinates.lng}&zoom=15&maptype=roadmap`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <IconMapPin className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Address */}
            {address && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="font-medium text-base md:text-lg">{address.address}</p>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="gap-2 w-full sm:w-auto text-sm md:text-base min-h-[2.5rem]"
                  asChild
                >
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconMapPin className="w-4 h-4" />
                    Get Directions
                    <IconExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Right Column - Hours */}
          <div className="overflow-hidden">
            {/* Hours Table */}
            {hours?.timetable ? (
              <div className="space-y-1">
                {orderedDays.map(day => {
                  const slots = hours?.timetable[day]
                  const isToday = mounted && day === currentDay

                  return (
                    <div 
                      key={day}
                      className={cn(
                        "flex items-center py-2 text-sm md:text-base px-3",
                        isToday && "bg-muted/50 rounded-md"
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 md:gap-4">
                          <span className={cn(
                            "capitalize font-medium text-foreground w-14 md:w-20",
                            isToday && "font-semibold"
                          )}>
                            {day.slice(0, 3)}
                          </span>
                          {!slots || slots.length === 0 ? (
                            <span className="text-destructive font-medium">Closed</span>
                          ) : (
                            <span className="text-foreground font-medium">
                              {formattedTimes[day]}
                            </span>
                          )}
                        </div>
                      </div>
                      {isToday && mounted && (
                        <span className={cn(
                          "text-xs md:text-sm font-medium ml-2",
                          isOpen ? "text-emerald-600" : "text-destructive"
                        )}>
                          {isOpen ? "Open now" : "Closed now"}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">Hours not available</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 
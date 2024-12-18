"use client"

import * as React from "react"
import { BusinessHeaderProps } from './types'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  IconStar, 
  IconShieldCheck,
  IconClock,
  IconPhone,
  IconMapPin,
  IconExternalLink,
  IconShare2,
  IconDots,
  IconMail,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconCopy,
  IconCheck
} from "@tabler/icons-react"
import { cn, getTimezoneFromState } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { isValidCity } from "@/lib/utils"

export function BusinessHeader({ business, category, searchOrigin }: BusinessHeaderProps) {
  const [currentStatus, setCurrentStatus] = React.useState<'open' | 'closed'>('closed')
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [shareUrl, setShareUrl] = React.useState('')
  const pathname = usePathname()

  // Handle all client-side operations in useEffect
  React.useEffect(() => {
    // Set share URL
    setShareUrl(`${window.location.origin}${pathname}`)

    // Check business hours
    if (business.work_hours?.timetable && business.state) {
      const timezone = getTimezoneFromState(business.state);
      const now = new Date().toLocaleString('en-US', { timeZone: timezone });
      const currentDate = new Date(now);
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = days[currentDate.getDay()];
      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();

      const todaySchedule = business.work_hours.timetable[today];
      if (todaySchedule && todaySchedule.length > 0) {
        const schedule = todaySchedule[0];
        const isOpen = 
          (currentHour > schedule.open.hour || 
           (currentHour === schedule.open.hour && currentMinute >= schedule.open.minute)) &&
          (currentHour < schedule.close.hour || 
           (currentHour === schedule.close.hour && currentMinute < schedule.close.minute));
        
        setCurrentStatus(isOpen ? 'open' : 'closed');
      } else {
        setCurrentStatus('closed');
      }
    }
  }, [pathname, business.work_hours, business.state])

  const shareText = `Check out ${business.title} on Blynt`

  const formatTime = (time: { hour: number; minute: number }) => {
    const period = time.hour >= 12 ? 'PM' : 'AM';
    const hour12 = time.hour % 12 || 12;
    return `${hour12}:${time.minute.toString().padStart(2, '0')} ${period}`;
  };

  const getStatusText = () => {
    if (!business.work_hours?.timetable || !business.state) return '';
    
    const timezone = getTimezoneFromState(business.state);
    const now = new Date().toLocaleString('en-US', { timeZone: timezone });
    const currentDate = new Date(now);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[currentDate.getDay()];
    
    const todaySchedule = business.work_hours.timetable[today];
    if (!todaySchedule || todaySchedule.length === 0) return 'Closed';
    
    const schedule = todaySchedule[0];
    if (currentStatus === 'open') {
      return `Open • Closes at ${formatTime(schedule.close)}`;
    } else {
      return `Closed • Opens at ${formatTime(schedule.open)}`;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareButtons: Array<{
    name: string;
    icon: React.FC<{ className?: string }>;
    href: string;
    color: string;
  }> = [
    {
      name: 'Email',
      icon: IconMail,
      href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`,
      color: 'text-gray-600'
    },
    {
      name: 'Facebook',
      icon: IconBrandFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'text-blue-600'
    },
    {
      name: 'Twitter',
      icon: IconBrandTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'text-sky-500'
    },
    {
      name: 'WhatsApp',
      icon: IconBrandWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'text-green-600'
    }
  ]

  // Get all categories and limit to first 3
  const allCategories = [business.category, ...(business.additional_categories || [])].filter(Boolean)
  const displayCategories = allCategories.slice(0, 3)
  const remainingCount = Math.max(0, allCategories.length - 3)

  // Get current day's hours
  const getCurrentDayHours = () => {
    if (!business.work_hours?.timetable) return null;
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    const todaySchedule = business.work_hours.timetable[today];
    if (!todaySchedule || todaySchedule.length === 0) return null;
    
    const schedule = todaySchedule[0];
    const formatTime = (time: { hour: number; minute: number }) => {
      const period = time.hour >= 12 ? 'PM' : 'AM';
      const hour12 = time.hour % 12 || 12;
      return `${hour12}:${time.minute.toString().padStart(2, '0')} ${period}`;
    };
    
    return `${formatTime(schedule.open)} - ${formatTime(schedule.close)}`;
  };

  const todayHours = getCurrentDayHours();

  return (
    <div className="space-y-3 md:space-y-4 w-full overflow-hidden">
      {/* Business Name and Categories */}
      <div className="space-y-2 w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight break-words">
          {business.title}
        </h1>
        
        {/* Categories moved here, right under the title */}
        {displayCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm w-full">
            {displayCategories.map((cat, index) => (
              <Badge 
                key={cat} 
                variant="secondary" 
                className="bg-primary/5 hover:bg-primary/10 text-xs sm:text-sm whitespace-nowrap"
              >
                {cat}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <span className="text-muted-foreground text-xs sm:text-sm">
                +{remainingCount} more categories
              </span>
            )}
          </div>
        )}
      </div>

      {/* Rating and Reviews */}
      {business.rating && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <IconStar
                key={i}
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7",
                  i < Math.floor(business.rating?.value || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                )}
              />
            ))}
            <span className="ml-1.5 sm:ml-2 text-base sm:text-lg md:text-xl font-medium">
              {business.rating.value}
            </span>
          </div>
          <span className="text-muted-foreground text-sm sm:text-base md:text-lg">
            ({business.rating.votes_count} {business.rating.votes_count === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      )}

      {/* Verification Badge */}
      {business.is_claimed && (
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 gap-1 text-xs sm:text-sm">
          <IconShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          Verified Business
        </Badge>
      )}

      {/* Hours Status */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base">
        {business.work_hours && (
          <>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "font-medium",
                currentStatus === 'open' ? "text-emerald-600" : "text-destructive"
              )}>
                {currentStatus === 'open' ? 'Open' : 'Closed'}
              </span>
              {business.work_hours.timetable && (
                <span className="text-muted-foreground">
                  {(() => {
                    const status = getStatusText();
                    const parts = status.split('•');
                    return parts.length > 1 ? `• ${parts[1].trim()}` : '';
                  })()}
                </span>
              )}
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs sm:text-sm hover:text-primary"
              onClick={() => {
                document.getElementById('hours-section')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'center',
                  inline: 'nearest'
                })
              }}
            >
              See hours
            </Button>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-4 w-full">
        {business.phone && (
          <Button className="gap-2" size="sm" asChild>
            <a href={`tel:${business.phone}`}>
              <IconPhone className="w-4 h-4" />
              Call Now
            </a>
          </Button>
        )}
        
        {business.latitude && business.longitude && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://www.google.com/maps?q=${business.latitude},${business.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <IconMapPin className="w-4 h-4" />
              Get Directions
            </a>
          </Button>
        )}

        {business.url && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={business.url}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <IconExternalLink className="w-4 h-4" />
              Website
            </a>
          </Button>
        )}

        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={() => setShareDialogOpen(true)}
        >
          <IconShare2 className="w-4 h-4" />
          Share
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <IconDots className="w-4 h-4" />
          More
        </Button>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share {business.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Share URL */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 rounded-md border bg-muted"
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <IconCheck className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <IconCopy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-2">
              {shareButtons.map((button) => (
                <Button
                  key={button.name}
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a
                    href={button.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`gap-2 ${button.color}`}
                  >
                    <button.icon className="w-4 h-4" />
                    {button.name}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
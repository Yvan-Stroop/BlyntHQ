"use client"

import { IconLoader2 } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'card' | 'business' | 'location';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  count?: number;
  className?: string;
}

export function Loading({ 
  variant = 'spinner',
  size = 'md',
  text = 'Loading...',
  count = 1,
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (variant === 'spinner') {
    return (
      <div 
        role="status" 
        aria-label={text}
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          className
        )}
      >
        <IconLoader2 
          className={cn(
            "animate-spin text-primary",
            sizeClasses[size]
          )} 
        />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
        <span className="sr-only">{text}</span>
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div 
        role="status" 
        aria-label={text}
        className={cn("space-y-4", className)}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="space-y-2.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
        <span className="sr-only">{text}</span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div 
        role="status" 
        aria-label={text}
        className={cn("grid gap-6", className)}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <span className="sr-only">{text}</span>
      </div>
    )
  }

  if (variant === 'business') {
    return (
      <div 
        role="status" 
        aria-label={text}
        className={cn("grid gap-6", className)}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-48 bg-muted animate-pulse" />
                <div className="flex-1 p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <span className="sr-only">{text}</span>
      </div>
    )
  }

  if (variant === 'location') {
    return (
      <div 
        role="status" 
        aria-label={text}
        className={cn("grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4", className)}
      >
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
        <span className="sr-only">{text}</span>
      </div>
    )
  }
}

export function LoadingBusinesses() {
  return (
    <Loading 
      variant="business" 
      count={3} 
      text="Loading businesses..."
    />
  )
}

export function LoadingLocations() {
  return (
    <Loading 
      variant="location" 
      count={4} 
      text="Loading locations..."
    />
  )
}

export function LoadingContent() {
  return (
    <Loading 
      variant="skeleton" 
      count={3} 
      text="Loading content..."
    />
  )
}

export function LoadingSpinner() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  )
}
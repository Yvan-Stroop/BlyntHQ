"use client"

import { 
  IconCategory, 
  IconClock,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface HeroProps {
  category: {
    name: string;
    slug: string;
  };
  city: string;
  state: string;  // This will now be the full state name
  totalResults: number;
}

export function Hero({ 
  category,
  city,
  state,
  totalResults
}: HeroProps) {
  return (
    <section className="bg-white border-b">
      <div className="container py-8 space-y-6">
        {/* Title and Stats */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Top 10 Best {category.name}s in {city}, {state}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconCategory className="w-4 h-4" />
              <span>{totalResults} total businesses found</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="w-4 h-4" />
              <span>Updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
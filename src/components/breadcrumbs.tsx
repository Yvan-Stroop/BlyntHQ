"use client"

import * as React from "react"
import Link from "next/link"
import { IconChevronRight, IconHome } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { BreadcrumbConfig } from "@/types/breadcrumb"

interface BreadcrumbsProps {
  items: BreadcrumbConfig[];
  className?: string;
  separator?: React.ReactNode;
  homeHref?: string;
  showHome?: boolean;
  currentPageLabel?: string;
  ariaLabel?: string;
}

export function Breadcrumbs({ 
  items, 
  className,
  separator = <IconChevronRight className="w-4 h-4 text-muted-foreground/50" />,
  homeHref = "/",
  showHome = true,
  currentPageLabel = "Current page",
  ariaLabel = "Breadcrumb"
}: BreadcrumbsProps) {
  // Filter out any 'home' type items since we handle home icon separately
  const filteredItems = items.filter(item => item.type !== 'home');

  // Generate schema.org structured data with enhanced markup
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${process.env.NEXT_PUBLIC_SITE_URL || ""}#breadcrumbs`,
    "name": "Breadcrumb Navigation",
    "description": "Navigation path to the current page",
    "itemListElement": [
      // Add home if shown
      ...(showHome ? [{
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "WebPage",
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL || ""}${homeHref}`,
          "name": "Home",
          "description": "Return to homepage",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || ""}${homeHref}`
        }
      }] : []),
      // Add rest of items with enhanced markup
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": showHome ? index + 2 : index + 1,
        "item": {
          "@type": "WebPage",
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL || ""}${item.href}`,
          "name": item.label,
          "description": item.description || `Navigate to ${item.label}`,
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || ""}${item.href}`
        }
      }))
    ]
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Breadcrumb navigation */}
      <nav 
        aria-label={ariaLabel}
        className={cn(
          "flex items-center text-sm text-muted-foreground",
          className
        )}
      >
        <ol 
          className="flex items-center flex-wrap gap-2"
          role="list"
          aria-label="Breadcrumb navigation"
        >
          {/* Home icon */}
          {showHome && (
            <li className="flex items-center">
              <Link 
                href={homeHref}
                className="flex items-center hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                aria-label="Home"
                title="Return to homepage"
              >
                <IconHome className="w-4 h-4" />
              </Link>
              {filteredItems.length > 0 && (
                <span 
                  className="mx-2 select-none" 
                  aria-hidden="true"
                  role="presentation"
                >
                  {separator}
                </span>
              )}
            </li>
          )}

          {/* Breadcrumb items */}
          {filteredItems.map((item, index) => (
            <li 
              key={item.href}
              className="flex items-center"
              aria-current={index === filteredItems.length - 1 ? "page" : undefined}
            >
              {/* If it's the last item, don't make it a link */}
              {index === filteredItems.length - 1 ? (
                <span 
                  className="font-medium text-foreground"
                  aria-current="page"
                  title={item.description}
                >
                  {item.icon && (
                    <span className="mr-2" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                  <span className="sr-only">{currentPageLabel}</span>
                </span>
              ) : (
                <>
                  <Link 
                    href={item.href}
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    title={item.description}
                  >
                    {item.icon && (
                      <span className="mr-2" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Link>
                  {index < filteredItems.length - 1 && (
                    <span 
                      className="mx-2 select-none" 
                      aria-hidden="true"
                      role="presentation"
                    >
                      {separator}
                    </span>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Helper component for responsive breadcrumbs
export function ResponsiveBreadcrumbs({ 
  items,
  ...props
}: BreadcrumbsProps) {
  // Always show all items in their original order
  return <Breadcrumbs items={items} {...props} />;
}

// Helper component for dynamic breadcrumbs
export function DynamicBreadcrumbs({
  segments,
  generateHref,
  ...props
}: {
  segments: string[];
  generateHref: (segments: string[], index: number) => string;
} & Omit<BreadcrumbsProps, 'items'>) {
  const items: BreadcrumbConfig[] = segments.map((segment, index) => ({
    type: 'category', // or determine type based on segment/index
    label: segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    href: generateHref(segments, index),
    description: `Navigate to ${segment}`
  }));

  return <Breadcrumbs items={items} {...props} />;
} 
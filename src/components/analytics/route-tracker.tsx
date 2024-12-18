"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

function RouteTrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    // @ts-ignore
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }, [pathname, searchParams])

  return null
}

export function GoogleAnalyticsRouteTracker() {
  return (
    <RouteTrackerInner />
  )
} 
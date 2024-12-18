export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : (process.env.NEXT_PUBLIC_SITE_URL || 'https://getblynt.com')

export const SITEMAP_CONFIG = {
  static: {
    changefreq: 'daily' as const,
    priority: 1.0
  },
  categories: {
    changefreq: 'daily' as const,
    priority: 0.9
  },
  states: {
    changefreq: 'daily' as const,
    priority: 0.8
  },
  cities: {
    changefreq: 'daily' as const,
    priority: 0.7
  },
  businesses: {
    changefreq: 'daily' as const,
    priority: 0.9
  }
}
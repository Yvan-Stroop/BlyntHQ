import { loadCategoriesFromCSV, loadLocationsFromCSV } from './csv'
import { supabase } from './supabase'
import { BASE_URL, SITEMAP_CONFIG } from './config'

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export async function getSitemapUrls(type: string): Promise<SitemapUrl[]> {
  switch (type) {
    case 'static':
      return getStaticPageUrls()
    case 'categories':
      return getCategoryUrls()
    case 'locations':
    case 'cities':
      return getLocationUrls()
    case 'businesses':
      return getBusinessUrls()
    default:
      return []
  }
}

async function getStaticPageUrls(): Promise<SitemapUrl[]> {
  const currentDate = new Date().toISOString()
  
  return [
    {
      loc: BASE_URL,
      lastmod: currentDate,
      changefreq: SITEMAP_CONFIG.static.changefreq,
      priority: SITEMAP_CONFIG.static.priority
    },
    {
      loc: `${BASE_URL}/categories`,
      lastmod: currentDate,
      changefreq: SITEMAP_CONFIG.categories.changefreq,
      priority: SITEMAP_CONFIG.categories.priority
    },
    {
      loc: `${BASE_URL}/locations`,
      lastmod: currentDate,
      changefreq: SITEMAP_CONFIG.states.changefreq,
      priority: SITEMAP_CONFIG.states.priority
    },
    {
      loc: `${BASE_URL}/add-business`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${BASE_URL}/claim-business`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${BASE_URL}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${BASE_URL}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    }
  ]
}

async function getCategoryUrls(): Promise<SitemapUrl[]> {
  const categories = await loadCategoriesFromCSV()
  const currentDate = new Date().toISOString()

  return categories.map(category => ({
    loc: `${BASE_URL}/categories/${category.slug}`,
    lastmod: currentDate,
    changefreq: SITEMAP_CONFIG.categories.changefreq,
    priority: SITEMAP_CONFIG.categories.priority
  }))
}

async function getLocationUrls(): Promise<SitemapUrl[]> {
  const locations = await loadLocationsFromCSV()
  const currentDate = new Date().toISOString()

  return locations.map(location => {
    const citySlug = location.city.toLowerCase().replace(/\s+/g, '-')
    return {
      loc: `${BASE_URL}/locations/${location.state_abbr.toLowerCase()}/${citySlug}`,
      lastmod: currentDate,
      changefreq: SITEMAP_CONFIG.cities.changefreq,
      priority: SITEMAP_CONFIG.cities.priority
    }
  })
}

async function getBusinessUrls(): Promise<SitemapUrl[]> {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('slug, updated_at')
    .order('updated_at', { ascending: false })

  if (error || !businesses) {
    console.error('Error fetching businesses for sitemap:', error)
    return []
  }

  return businesses.map(business => ({
    loc: `${BASE_URL}/biz/${business.slug}`,
    lastmod: business.updated_at || new Date().toISOString(),
    changefreq: SITEMAP_CONFIG.businesses.changefreq,
    priority: SITEMAP_CONFIG.businesses.priority
  }))
} 
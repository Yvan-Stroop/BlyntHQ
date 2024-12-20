require('dotenv').config({ path: '.env.local' })

const fs = require('fs')
const path = require('path')
const { supabase } = require('../lib/supabase')
const { SITEMAP_CONFIG } = require('../lib/config')
const { loadCategoriesFromCSV, loadLocationsFromCSV } = require('../lib/csv')
const { parseStringPromise, Builder } = require('xml2js')
const { formatCategoryForUrl, formatCityForUrl, normalizeUrlCity } = require('../lib/utils')
const { getLocationBusinesses } = require('../lib/services/business')

// Define types based on our CSV structure
interface Category {
  name: string
  slug: string
}

interface Location {
  city: string
  state: string
  state_abbr: string
  county_fips: string
  county_name: string
  lat: number
  lng: number
  zips: string
  id: string
}

interface Business {
  slug: string
  updated_at: string | null
}

interface SitemapUrl {
  loc: string[]
  lastmod: string[]
  changefreq: string[]
  priority: string[]
}

const SITEMAP_DIR = path.join(process.cwd(), 'public', 'sitemaps')
const SUPABASE_CHUNK_SIZE = 1000 // Maximum records Supabase can return
const SITEMAP_MAX_URLS = 50000 // Maximum URLs per sitemap file
const BASE_URL = 'https://getblynt.com'

async function ensureDirectory() {
  if (!fs.existsSync(SITEMAP_DIR)) {
    fs.mkdirSync(SITEMAP_DIR, { recursive: true })
  }
}

async function readExistingSitemap(filename: string): Promise<SitemapUrl[]> {
  const filepath = path.join(SITEMAP_DIR, filename)
  if (!fs.existsSync(filepath)) {
    return []
  }

  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    const result = await parseStringPromise(content)
    return result.urlset?.url || []
  } catch (error) {
    console.warn(`Warning: Could not parse ${filename}, treating as empty`)
    return []
  }
}

async function generateBusinessSitemaps() {
  console.log('Generating business sitemaps...')
  
  // Get existing business URLs to maintain lastmod dates
  const existingUrls = new Set<string>()
  const existingSitemap = await readExistingSitemap('businesses-1.xml')
  existingSitemap.forEach(url => {
    existingUrls.add(url.loc[0])
  })

  // Load categories and locations
  const [categories, locations] = await Promise.all([
    loadCategoriesFromCSV(),
    loadLocationsFromCSV()
  ])

  if (!categories?.length || !locations?.length) {
    console.warn('No categories or locations found')
    return []
  }

  console.log('Fetching filtered businesses for each category and location...')
  
  const sitemapFiles = []
  let currentSitemapIndex = 1
  let currentSitemapUrls: SitemapUrl[] = []
  const processedBusinessIds = new Set<string>() // Track processed businesses

  // Process each category and location combination
  for (const category of categories) {
    console.log(`Processing category: ${category.name}`)
    
    for (const location of locations) {
      const state = location.state_abbr.toLowerCase()
      const city = normalizeUrlCity(location.city)

      try {
        // Use the same filtering logic as the website
        const result = await getLocationBusinesses({
          state,
          city
        })

        // Only process if we have businesses
        if (result.businesses && result.businesses.length > 0) {
          for (const business of result.businesses) {
            // Skip if we've already processed this business
            if (processedBusinessIds.has(business.id!)) continue
            processedBusinessIds.add(business.id!)

            const url = `${BASE_URL}/biz/${business.slug}`

            // Check if URL exists and hasn't been updated
            if (existingUrls.has(url)) {
              const existingEntry = existingSitemap.find(entry => entry.loc[0] === url)
              if (existingEntry) {
                currentSitemapUrls.push(existingEntry)
                continue
              }
            }

            // Add new or updated entry
            currentSitemapUrls.push({
              loc: [url],
              lastmod: [new Date().toISOString().split('T')[0]],
              changefreq: [SITEMAP_CONFIG.businesses.changefreq],
              priority: [SITEMAP_CONFIG.businesses.priority.toString()]
            })

            // Write sitemap if we've reached the maximum URLs per sitemap
            if (currentSitemapUrls.length >= SITEMAP_MAX_URLS) {
              await writeSitemap(currentSitemapUrls, `businesses-${currentSitemapIndex}.xml`)
              sitemapFiles.push({
                name: `businesses-${currentSitemapIndex}.xml`,
                lastmod: new Date().toISOString().split('T')[0]
              })
              currentSitemapIndex++
              currentSitemapUrls = []
            }
          }
        }
      } catch (error) {
        console.error(`Error processing ${category.name} in ${city}, ${state}:`, error)
        continue
      }
    }
  }

  // Write remaining URLs if any
  if (currentSitemapUrls.length > 0) {
    await writeSitemap(currentSitemapUrls, `businesses-${currentSitemapIndex}.xml`)
    sitemapFiles.push({
      name: `businesses-${currentSitemapIndex}.xml`,
      lastmod: new Date().toISOString().split('T')[0]
    })
  }

  console.log(`Total businesses processed: ${processedBusinessIds.size}`)
  return sitemapFiles
}

async function writeSitemap(urls: SitemapUrl[], filename: string) {
  const builder = new Builder()
  const xml = builder.buildObject({
    urlset: {
      $: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
      },
      url: urls
    }
  })
  
  fs.writeFileSync(path.join(SITEMAP_DIR, filename), xml)
  console.log(`Written ${urls.length} URLs to ${filename}`)
}

async function generateStaticSitemap() {
  console.log('Generating static sitemap...')
  const staticUrls = [
    { url: '', priority: 1.0 },
    { url: 'categories', priority: 0.9 },
    { url: 'locations', priority: 0.9 },
    { url: 'about', priority: 0.7 },
    { url: 'contact', priority: 0.7 },
    { url: 'add-business', priority: 0.7 },
    { url: 'claim-business', priority: 0.7 },
    { url: 'privacy', priority: 0.5 },
    { url: 'terms', priority: 0.5 }
  ]

  const builder = new Builder({
    xmldec: { version: '1.0', encoding: 'UTF-8' }
  })
  
  const sitemapObj = {
    urlset: {
      $: {
        xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
      },
      url: staticUrls.map(({ url, priority }) => ({
        loc: [BASE_URL + (url ? `/${url}` : '')],
        lastmod: [new Date().toISOString().split('T')[0]],
        changefreq: [SITEMAP_CONFIG.static.changefreq],
        priority: [priority.toString()]
      }))
    }
  }

  const sitemap = builder.buildObject(sitemapObj)
  
  const filename = 'static.xml'
  const filePath = path.join(SITEMAP_DIR, filename)
  fs.writeFileSync(filePath, sitemap)
  console.log(`Written static sitemap to ${filename}`)
  
  return [{
    name: filename,
    lastmod: new Date().toISOString().split('T')[0]
  }]
}

async function generateCategoryIndexSitemap() {
  console.log('Generating category index sitemap...')
  const categories = await loadCategoriesFromCSV() as Category[]
  
  if (!categories?.length) {
    console.warn('No categories found')
    return []
  }
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${categories.map(category => `
      <url>
        <loc>${BASE_URL}/categories/${category.slug}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${SITEMAP_CONFIG.categories.changefreq}</changefreq>
        <priority>${SITEMAP_CONFIG.categories.priority}</priority>
      </url>
    `).join('')}
  </urlset>`
  
  const filename = 'category-index.xml'
  const filePath = path.join(SITEMAP_DIR, filename)
  fs.writeFileSync(filePath, sitemap)
  console.log(`Written ${categories.length} categories to ${filename}`)
  
  return [{
    name: filename,
    lastmod: new Date().toISOString().split('T')[0]
  }]
}

async function generateLocationSitemaps() {
  console.log('Generating location sitemaps...')
  const [categories, locations] = await Promise.all([
    loadCategoriesFromCSV() as Promise<Category[]>,
    loadLocationsFromCSV() as Promise<Location[]>
  ])
  
  if (!categories?.length || !locations?.length) {
    console.warn('No categories or locations found')
    return []
  }

  // Generate locations sitemap (state/city pages only, main locations page is in static.xml)
  const states = Array.from(new Set(locations.map(l => l.state_abbr.toLowerCase())))
  const locationUrls = [
    // State pages
    ...states.map(state => ({
      loc: `${BASE_URL}/locations/${state}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: SITEMAP_CONFIG.states.changefreq,
      priority: SITEMAP_CONFIG.states.priority
    })),
    // City pages
    ...locations.map(location => ({
      loc: `${BASE_URL}/locations/${location.state_abbr.toLowerCase()}/${normalizeUrlCity(location.city)}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: SITEMAP_CONFIG.cities.changefreq,
      priority: SITEMAP_CONFIG.cities.priority
    }))
  ]

  const locationsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${locationUrls.map(url => `
      <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
      </url>
    `).join('')}
  </urlset>`

  const locationsFilename = 'locations.xml'
  fs.writeFileSync(path.join(SITEMAP_DIR, locationsFilename), locationsSitemap)
  console.log(`Written ${locationUrls.length} location URLs to ${locationsFilename}`)

  // Generate category-states sitemap
  const categoryStatesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${states.flatMap(state => 
      categories.map(category => `
        <url>
          <loc>${BASE_URL}/categories/${category.slug}/${state}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>${SITEMAP_CONFIG.states.changefreq}</changefreq>
          <priority>${SITEMAP_CONFIG.states.priority}</priority>
        </url>
      `)
    ).join('')}
  </urlset>`
  
  const categoryStatesFilename = 'category-states.xml'
  fs.writeFileSync(path.join(SITEMAP_DIR, categoryStatesFilename), categoryStatesSitemap)
  console.log(`Written ${states.length * categories.length} category-state URLs to ${categoryStatesFilename}`)

  // Generate category-cities sitemap
  const categoryCitiesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${locations.flatMap(location => 
      categories.map(category => `
        <url>
          <loc>${BASE_URL}/categories/${category.slug}/${location.state_abbr.toLowerCase()}/${normalizeUrlCity(location.city)}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>${SITEMAP_CONFIG.cities.changefreq}</changefreq>
          <priority>${SITEMAP_CONFIG.cities.priority}</priority>
        </url>
      `)
    ).join('')}
  </urlset>`
  
  const categoryCitiesFilename = 'category-cities.xml'
  fs.writeFileSync(path.join(SITEMAP_DIR, categoryCitiesFilename), categoryCitiesSitemap)
  console.log(`Written ${locations.length * categories.length} category-city URLs to ${categoryCitiesFilename}`)

  return [
    { name: locationsFilename, lastmod: new Date().toISOString().split('T')[0] },
    { name: categoryStatesFilename, lastmod: new Date().toISOString().split('T')[0] },
    { name: categoryCitiesFilename, lastmod: new Date().toISOString().split('T')[0] }
  ]
}

async function main() {
  try {
    console.log('Starting sitemap generation...')
    await ensureDirectory()
    
    // Generate all sitemaps and collect their filenames
    const [businessFiles, staticFiles, categoryIndexFiles, locationFiles] = await Promise.all([
      generateBusinessSitemaps(),
      generateStaticSitemap(),
      generateCategoryIndexSitemap(),
      generateLocationSitemaps()
    ])
    
    // Combine all sitemap files
    const allSitemapFiles = [
      ...staticFiles,
      ...categoryIndexFiles,
      ...locationFiles,
      ...businessFiles
    ]
    
    // Generate the index file
    await generateSitemapIndex(allSitemapFiles)
    
    console.log('Sitemap generation completed successfully!')
  } catch (error) {
    console.error('Error generating sitemaps:', error)
    process.exit(1)
  }
}

async function generateSitemapIndex(sitemapFiles: Array<{ name: string, lastmod: string }>) {
  console.log('Generating sitemap index...')
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapFiles.map(({ name, lastmod }) => `
      <sitemap>
        <loc>${BASE_URL}/sitemaps/${name}</loc>
        <lastmod>${lastmod}</lastmod>
      </sitemap>
    `).join('')}
  </sitemapindex>`
  
  const filename = path.join(process.cwd(), 'public', 'sitemap_index.xml')
  fs.writeFileSync(filename, sitemapIndex)
  console.log(`Written sitemap index to sitemap_index.xml`)
}

main() 
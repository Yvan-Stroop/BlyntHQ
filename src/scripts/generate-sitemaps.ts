const fs = require('fs')
const path = require('path')
const { supabase } = require('../lib/supabase')
const { SITEMAP_CONFIG } = require('../lib/config')
const { loadCategoriesFromCSV, loadLocationsFromCSV } = require('../lib/csv')
const { parseStringPromise, Builder } = require('xml2js')
const { formatCategoryForUrl, formatCityForUrl, normalizeUrlCity } = require('../lib/utils')

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
  
  // Get existing business URLs
  const existingUrls = new Set<string>()
  const existingSitemap = await readExistingSitemap('businesses-1.xml')
  existingSitemap.forEach(url => {
    existingUrls.add(url.loc[0])
  })
  
  // Get total count of businesses
  const { count } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
  
  if (!count) {
    console.warn('No businesses found')
    return []
  }
  
  console.log(`Found ${count} businesses in Supabase`)
  
  const sitemapFiles = []
  let currentSitemapIndex = 1
  let currentSitemapUrls: SitemapUrl[] = []
  
  // Fetch businesses in chunks of 1000 (Supabase limit)
  for (let offset = 0; offset < count; offset += SUPABASE_CHUNK_SIZE) {
    console.log(`Fetching businesses ${offset + 1} to ${Math.min(offset + SUPABASE_CHUNK_SIZE, count)}...`)
    
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('slug, updated_at')
      .range(offset, offset + SUPABASE_CHUNK_SIZE - 1)
    
    if (error) {
      console.error('Error fetching businesses:', error)
      continue
    }
    
    if (!businesses?.length) continue
    
    // Process each business
    businesses.forEach((business: Business) => {
      const url = `${BASE_URL}/biz/${business.slug}`
      
      // Skip if URL already exists and hasn't been updated
      if (existingUrls.has(url)) {
        const existingEntry = existingSitemap.find(entry => entry.loc[0] === url)
        if (existingEntry && existingEntry.lastmod[0] === business.updated_at?.split('T')[0]) {
          currentSitemapUrls.push(existingEntry)
          return
        }
      }
      
      // Add new or updated entry
      currentSitemapUrls.push({
        loc: [url],
        lastmod: [business.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0]],
        changefreq: [SITEMAP_CONFIG.businesses.changefreq],
        priority: [SITEMAP_CONFIG.businesses.priority.toString()]
      })
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
  
  // Write remaining URLs if any
  if (currentSitemapUrls.length > 0) {
    await writeSitemap(currentSitemapUrls, `businesses-${currentSitemapIndex}.xml`)
    sitemapFiles.push({
      name: `businesses-${currentSitemapIndex}.xml`,
      lastmod: new Date().toISOString().split('T')[0]
    })
  }
  
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
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls.map(({ url, priority }) => `
      <url>
        <loc>${BASE_URL}${url ? `/${url}` : ''}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${SITEMAP_CONFIG.static.changefreq}</changefreq>
        <priority>${priority}</priority>
      </url>
    `).join('')}
  </urlset>`
  
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
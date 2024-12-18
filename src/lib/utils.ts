import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from './supabase';
import { parse } from 'csv-parse/sync';
import { BreadcrumbConfig } from "@/types/breadcrumb"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phoneNumber
}

/**
 * Normalizes a business title for use in URLs.
 * Handles special characters, removes common business suffixes, and normalizes spacing.
 */
function normalizeBusinessTitle(title: string): string {
  return title
    .toLowerCase()
    // Remove common business suffixes
    .replace(/\b(inc|llc|ltd|corp|corporation)\b\.?/gi, '')
    // German specific: Convert umlauts before normalization
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    // Normalize remaining unicode characters
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove periods and other special characters
    .replace(/['".,!?]/g, '')
    // Replace any non-alphanumeric character with a hyphen
    .replace(/[^a-z0-9]+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

/**
 * Normalizes a street address for use in URLs.
 * Handles common abbreviations, removes numbers, and normalizes formatting.
 */
function normalizeStreetAddress(street: string): string {
  const commonAbbreviations: { [key: string]: string } = {
    'street': 'st',
    'road': 'rd',
    'avenue': 'ave',
    'boulevard': 'blvd',
    'drive': 'dr',
    'lane': 'ln',
    'circle': 'cir',
    'court': 'ct',
    'parkway': 'pkwy',
    'highway': 'hwy',
    'place': 'pl',
    'terrace': 'ter',
    'square': 'sq',
  };

  return street
    .toLowerCase()
    // Remove building numbers and unit information
    .replace(/^[0-9-]+\s*/, '')
    .replace(/\s+#\s*[0-9a-z-]+$/i, '')
    .replace(/\s+(?:suite|ste|unit|apt|apartment|room|rm|#)\s*[0-9a-z-]+$/i, '')
    .replace(/\s+(?:floor|fl)\s*[0-9a-z-]+$/i, '')
    .replace(/\s*,.*$/, '')
    // Replace full words with abbreviations
    .replace(
      new RegExp(`\\b(${Object.keys(commonAbbreviations).join('|')})\\b`, 'gi'),
      match => commonAbbreviations[match.toLowerCase()]
    )
    // Normalize characters and spaces
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

/**
 * Generates a unique, SEO-friendly slug for a business.
 * Combines business title, street (optional), and city into a normalized URL slug.
 * 
 * Examples:
 * - "Joe's Pizza, Inc." at "123 Main St" in "St. Louis" → "joes-pizza-main-st-st-louis"
 * - "Café München" at "45 König Straße" in "München" → "cafe-muenchen-koenig-strasse-muenchen"
 * 
 * @param title - Business name
 * @param city - City name
 * @param street - Optional street address
 * @returns A URL-safe slug combining the parts
 */
export async function generateUniqueSlug(
  title: string | undefined | null, 
  city: string | undefined | null,
  street?: string | undefined | null
): Promise<string> {
  if (!title || !city) {
    throw new Error(`Cannot generate slug: title (${title}) or city (${city}) is missing`)
  }

  // Normalize each part
  const titleSlug = normalizeBusinessTitle(title);
  const citySlug = normalizeUrlCity(city);
  const streetSlug = street ? normalizeStreetAddress(street) : '';

  // Combine parts to create the base slug
  const slugParts = [titleSlug, streetSlug, citySlug].filter(Boolean);

  // Create and return the final slug (limited to 100 chars for URL best practices)
  return slugParts.join('-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

export function formatLocationName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const STATE_MAPPING: { [key: string]: string } = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY'
};

export function getStateAbbreviation(fullStateName: string): string {
  return STATE_MAPPING[fullStateName] || fullStateName;
}

// US State to Timezone mapping
const STATE_TIMEZONES: { [key: string]: string } = {
  'AK': 'America/Anchorage',    // Alaska
  'AL': 'America/Chicago',      // Alabama
  'AR': 'America/Chicago',      // Arkansas
  'AZ': 'America/Phoenix',      // Arizona
  'CA': 'America/Los_Angeles',  // California
  'CO': 'America/Denver',       // Colorado
  'CT': 'America/New_York',     // Connecticut
  'DC': 'America/New_York',     // District of Columbia
  'DE': 'America/New_York',     // Delaware
  'FL': 'America/New_York',     // Florida
  'GA': 'America/New_York',     // Georgia
  'HI': 'Pacific/Honolulu',     // Hawaii
  'IA': 'America/Chicago',      // Iowa
  'ID': 'America/Boise',        // Idaho
  'IL': 'America/Chicago',      // Illinois
  'IN': 'America/Indiana/Indianapolis', // Indiana
  'KS': 'America/Chicago',      // Kansas
  'KY': 'America/New_York',     // Kentucky
  'LA': 'America/Chicago',      // Louisiana
  'MA': 'America/New_York',     // Massachusetts
  'MD': 'America/New_York',     // Maryland
  'ME': 'America/New_York',     // Maine
  'MI': 'America/Detroit',      // Michigan
  'MN': 'America/Chicago',      // Minnesota
  'MO': 'America/Chicago',      // Missouri
  'MS': 'America/Chicago',      // Mississippi
  'MT': 'America/Denver',       // Montana
  'NC': 'America/New_York',     // North Carolina
  'ND': 'America/Chicago',      // North Dakota
  'NE': 'America/Chicago',      // Nebraska
  'NH': 'America/New_York',     // New Hampshire
  'NJ': 'America/New_York',     // New Jersey
  'NM': 'America/Denver',       // New Mexico
  'NV': 'America/Los_Angeles',  // Nevada
  'NY': 'America/New_York',     // New York
  'OH': 'America/New_York',     // Ohio
  'OK': 'America/Chicago',      // Oklahoma
  'OR': 'America/Los_Angeles',  // Oregon
  'PA': 'America/New_York',     // Pennsylvania
  'RI': 'America/New_York',     // Rhode Island
  'SC': 'America/New_York',     // South Carolina
  'SD': 'America/Chicago',      // South Dakota
  'TN': 'America/Chicago',      // Tennessee
  'TX': 'America/Chicago',      // Texas
  'UT': 'America/Denver',       // Utah
  'VA': 'America/New_York',     // Virginia
  'VT': 'America/New_York',     // Vermont
  'WA': 'America/Los_Angeles',  // Washington
  'WI': 'America/Chicago',      // Wisconsin
  'WV': 'America/New_York',     // West Virginia
  'WY': 'America/Denver'        // Wyoming
};

export function getTimezoneFromState(state: string): string {
  // Try to get timezone from state abbreviation first
  if (STATE_TIMEZONES[state]) {
    return STATE_TIMEZONES[state];
  }
  
  // If full state name is provided, convert to abbreviation first
  const stateAbbr = getStateAbbreviation(state);
  return STATE_TIMEZONES[stateAbbr] || 'America/New_York'; // Default to ET if not found
}

export function isValidCity(city: string, state: string): boolean {
  try {
    // Use a dynamic import for fs to ensure it only runs on the server
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const csvContent = fs.readFileSync('src/data/locations.csv', 'utf-8');
      const records = parse(csvContent, { columns: true });
      
      // Normalize the input city name
      const normalizedInputCity = normalizeUrlCity(city);
      
      return records.some((record: any) => 
        normalizeUrlCity(record.city) === normalizedInputCity && 
        record.state_abbr === state
      );
    }
    return true; // Default to true on client-side
  } catch (error) {
    console.error('Error validating city:', error);
    return false;
  }
}

export function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normalizes a city name for use in URLs following web best practices.
 * 
 * Rules applied:
 * - Convert to lowercase (SEO best practice)
 * - Remove periods from abbreviations
 * - Remove apostrophes and quotes
 * - Convert spaces and special characters to hyphens
 * - Remove diacritical marks (é → e, ü → u, etc.)
 * - Handle common abbreviations
 * - Maximum length of 100 characters (URL length best practice)
 * - German specific: Convert umlauts (ä → ae, ö → oe, ü → ue)
 * - German specific: Convert ß → ss
 * 
 * Examples:
 * US Cities:
 * - "St. Louis Park" → "st-louis-park"
 * - "Winston-Salem" → "winston-salem"
 * - "Port St. Lucie" → "port-st-lucie"
 * - "D'Iberville" → "d-iberville"
 * - "São Paulo" → "sao-paulo"
 * - "Martha's Vineyard" → "marthas-vineyard"
 * 
 * German Cities:
 * - "München" → "muenchen"
 * - "Köln" → "koeln"
 * - "Bad Füssing" → "bad-fuessing"
 * - "Garmisch-Partenkirchen" → "garmisch-partenkirchen"
 * - "Sankt Goar" → "sankt-goar"
 * - "Rothenburg ob der Tauber" → "rothenburg-ob-der-tauber"
 * - "Frankfurt am Main" → "frankfurt-am-main"
 * - "Wangen im Allgäu" → "wangen-im-allgaeu"
 * - "Bad Münster am Stein" → "bad-muenster-am-stein"
 * - "Halle (Saale)" → "halle"
 * - "Bernau bei Berlin" → "bernau-bei-berlin"
 * 
 * @param city - The city name to normalize
 * @returns A URL-safe string with consistent formatting
 */
export function normalizeUrlCity(city: string): string {
  if (!city) return '';
  
  return city
    .toLowerCase()
    // German specific: Convert umlauts before normalization
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    // Normalize remaining unicode characters
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove periods
    .replace(/\./g, '')
    // Remove apostrophes and quotes
    .replace(/[''"]/g, '')
    // Remove parentheses and their contents
    .replace(/\([^)]*\)/g, '')
    // Remove commas and anything after them (state abbreviations, etc.)
    .replace(/,.*$/, '')
    // Replace forward slashes with hyphens
    .replace(/\//g, '-')
    // Replace any non-alphanumeric character with a hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Replace multiple consecutive hyphens with a single hyphen
    .replace(/-+/g, '-')
    .trim()
    // Limit length (100 chars is a reasonable URL segment length)
    .slice(0, 100);
}


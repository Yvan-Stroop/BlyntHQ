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

export async function generateUniqueSlug(
  title: string | undefined | null, 
  city: string | undefined | null,
  street?: string | undefined | null
): Promise<string> {
  if (!title || !city) {
    throw new Error(`Cannot generate slug: title (${title}) or city (${city}) is missing`)
  }

  // Extract the street name from the address, removing any numbers and common words
  let streetSlug = ''
  if (street) {
    streetSlug = street
      .toLowerCase()
      // Remove all variations of building numbers, suites, and units
      .replace(/^[0-9-]+\s*/, '') // Remove leading numbers
      .replace(/\s+#\s*[0-9a-z-]+$/i, '') // Remove trailing #123
      .replace(/\s+(?:suite|ste|unit|apt|apartment|room|rm|#)\s*[0-9a-z-]+$/i, '') // Remove suite/unit numbers
      .replace(/\s+(?:floor|fl)\s*[0-9a-z-]+$/i, '') // Remove floor numbers
      .replace(/\s*,.*$/, '') // Remove everything after a comma
      // Replace full words with abbreviations
      .replace(/\b(street)\b/gi, 'st')
      .replace(/\b(road)\b/gi, 'rd')
      .replace(/\b(avenue)\b/gi, 'ave')
      .replace(/\b(boulevard)\b/gi, 'blvd')
      .replace(/\b(drive)\b/gi, 'dr')
      .replace(/\b(lane)\b/gi, 'ln')
      .replace(/\b(circle)\b/gi, 'cir')
      .replace(/\b(court)\b/gi, 'ct')
      .replace(/\b(parkway)\b/gi, 'pkwy')
      .replace(/\b(highway)\b/gi, 'hwy')
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
  }

  // Combine parts to create the base slug
  const slugParts = [
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    streetSlug,
    city.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  ].filter(Boolean) // Remove empty parts

  // Create and return the final slug
  return slugParts.join('-').replace(/^-+|-+$/g, '').replace(/-+/g, '-')
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
      
      return records.some((record: any) => 
        record.city.toLowerCase() === city.toLowerCase() && 
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

export function normalizeUrlCity(city: string): string {
  return city
    .toLowerCase()
    .replace(/\./g, '') // Remove periods
    .replace(/[^a-z0-9]+/g, '-') // Replace other special chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
}


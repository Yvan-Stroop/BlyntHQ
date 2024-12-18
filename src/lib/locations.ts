export const STATE_ABBR_MAP: { [key: string]: string } = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming',
    'DC': 'District of Columbia',
    'PR': 'Puerto Rico',
    'VI': 'Virgin Islands',
    'GU': 'Guam',
    'MP': 'Northern Mariana Islands',
    'AS': 'American Samoa',
    'FM': 'Federated States of Micronesia'
  };
  
  export interface StateInfo {
    name: string;
    abbr: string;
    capital?: string;
    largestCity?: string;
    region?: string;
  }
  
  export function getStateNameFromAbbreviation(abbr: string): string | null {
    return STATE_ABBR_MAP[abbr.toUpperCase()] || null;
  }
  
  export function getStateAbbreviation(stateName: string): string | null {
    const entry = Object.entries(STATE_ABBR_MAP).find(
      ([_, name]) => name.toLowerCase() === stateName.toLowerCase()
    );
    return entry ? entry[0] : null;
  }
  
  export function isValidStateAbbreviation(abbr: string): boolean {
    return abbr.toUpperCase() in STATE_ABBR_MAP;
  }
  
  export function formatStateAbbreviation(abbr: string): string {
    return abbr.toUpperCase();
  }
  
  export function getAllStates(): StateInfo[] {
    return Object.entries(STATE_ABBR_MAP).map(([abbr, name]) => ({
      name,
      abbr,
    }));
  }
  
  export function getStatesByRegion(region: string): StateInfo[] {
    // Add region mapping if needed
    return [];
  }
  
  // Helper function to format location URLs
  export function formatLocationUrl(state: string, city?: string): string {
    const stateSlug = state.toLowerCase();
    if (!city) return `/${stateSlug}`;
    
    const citySlug = normalizeUrlCity(city);
    return `/${stateSlug}/${citySlug}`;
  } 
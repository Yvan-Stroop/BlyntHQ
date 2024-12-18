import { Category } from './csv'

interface CategoryContent {
  title: string;
  description: string;
  searchTips: string[];
  relatedCategories: string[];
  commonServices: string[];
  pricingGuide: {
    low: string;
    average: string;
    high: string;
    factors: string[];
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function generateCategoryContent(category: Category): CategoryContent {
  const categoryName = category.name.toLowerCase()
  const pluralName = categoryName.endsWith('y') 
    ? categoryName.slice(0, -1) + 'ies'
    : categoryName + 's'

  return {
    title: `Find Local ${category.name}s Near You`,
    description: `Discover and connect with trusted ${pluralName} in your area. Compare ratings, reviews, and services to find the perfect match for your needs.`,
    searchTips: [
      `Check reviews and ratings from verified customers`,
      `Compare pricing and service packages`,
      `Look for licensed and insured ${pluralName}`,
      `Verify business hours and availability`,
      `Ask about experience with your specific needs`
    ],
    commonServices: generateCommonServices(category),
    pricingGuide: generatePricingGuide(category),
    faqs: generateFAQs(category),
    relatedCategories: generateRelatedCategories(category)
  }
}

function generateCommonServices(category: Category): string[] {
  // Define common services for each category
  const categoryServices: Record<string, string[]> = {
    'tire-shop': [
      'Tire Installation',
      'Tire Rotation',
      'Wheel Balancing',
      'Tire Repair',
      'Wheel Alignment'
    ],
    'liquor-store': [
      'Wine Selection',
      'Spirits and Liquors',
      'Craft Beer',
      'Special Orders',
      'Gift Packaging'
    ],
    // Add more categories as needed
  }

  return categoryServices[category.slug] || [
    'General Services',
    'Consultation',
    'Custom Solutions',
    'Maintenance',
    'Support'
  ]
}

function generatePricingGuide(category: Category): CategoryContent['pricingGuide'] {
  // Define pricing guides for each category
  const categoryPricing: Record<string, CategoryContent['pricingGuide']> = {
    'tire-shop': {
      low: '$50 - $100',
      average: '$100 - $200',
      high: '$200+',
      factors: [
        'Tire brand and size',
        'Service type',
        'Location',
        'Season'
      ]
    },
    'liquor-store': {
      low: '$10 - $30',
      average: '$30 - $100',
      high: '$100+',
      factors: [
        'Brand',
        'Type of alcohol',
        'Age/vintage',
        'Region'
      ]
    },
    // Add more categories as needed
  }

  return categoryPricing[category.slug] || {
    low: 'Contact for pricing',
    average: 'Varies by service',
    high: 'Custom quote needed',
    factors: [
      'Service scope',
      'Location',
      'Experience level',
      'Specific requirements'
    ]
  }
}

function generateFAQs(category: Category): CategoryContent['faqs'] {
  const name = category.name.toLowerCase()
  
  return [
    {
      question: `How do I choose the right ${name}?`,
      answer: `When selecting a ${name}, consider their experience, reviews, pricing, and specializations. Make sure they're licensed and insured, and ask for references.`
    },
    {
      question: `What should I look for in reviews?`,
      answer: `Focus on recent reviews that mention specific services you need. Look for patterns in feedback about reliability, quality, and customer service.`
    },
    {
      question: `How much does a ${name} typically cost?`,
      answer: `Costs vary based on location, services needed, and experience level. We recommend getting quotes from multiple providers to compare.`
    },
    {
      question: `Are these ${name}s licensed and insured?`,
      answer: `Most listed businesses are licensed and insured, but we recommend verifying credentials directly with the business for your specific needs.`
    },
    {
      question: `How quickly can I get service?`,
      answer: `Service availability varies by provider. Many businesses offer same-day or next-day service, while others may require scheduling in advance.`
    }
  ]
}

function generateRelatedCategories(category: Category): string[] {
  // Define related categories for each type
  const categoryRelationships: Record<string, string[]> = {
    'tire-shop': ['auto-repair', 'car-dealer', 'mechanic'],
    'liquor-store': ['wine-shop', 'convenience-store', 'grocery-store'],
    // Add more relationships
  }

  return categoryRelationships[category.slug] || []
}

export function generateCategoryMeta(category: Category) {
  return {
    title: `${category.name}s Near Me - Find Local ${category.name}s | Blynt`,
    description: `Find the best ${category.name.toLowerCase()}s near you. Compare ratings, reviews, and contact information for local ${category.name.toLowerCase()} businesses.`,
  }
} 
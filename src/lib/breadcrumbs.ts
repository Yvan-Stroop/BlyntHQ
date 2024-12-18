import { BreadcrumbConfig } from '@/types/breadcrumb'
import { formatCategoryName } from '@/lib/utils'
import { loadCategoriesFromCSV, loadLocationsFromCSV } from '@/lib/csv'

let categoriesCache: Array<{ slug: string; name: string }> | null = null;
let locationsCache: Array<{ city: string; state: string; state_abbr: string }> | null = null;

async function ensureCacheLoaded() {
  if (!categoriesCache) {
    categoriesCache = await loadCategoriesFromCSV();
  }
  if (!locationsCache) {
    locationsCache = await loadLocationsFromCSV();
  }
}

async function isValidCategory(categorySlug: string): Promise<boolean> {
  await ensureCacheLoaded();
  return categoriesCache!.some(cat => cat.slug.toLowerCase() === categorySlug.toLowerCase());
}

async function isValidLocation(stateAbbr: string, city: string): Promise<boolean> {
  await ensureCacheLoaded();
  return locationsCache!.some(loc => 
    loc.state_abbr.toLowerCase() === stateAbbr.toLowerCase() && 
    loc.city.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '') === 
    city.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')
  );
}

async function findValidCategory(business: any): Promise<string | null> {
  await ensureCacheLoaded();
  
  // Check main category first
  if (business.category) {
    const mainCategorySlug = business.category.toLowerCase().replace(/\s+/g, '-');
    if (categoriesCache!.some(cat => cat.slug.toLowerCase() === mainCategorySlug)) {
      return business.category;
    }
  }

  // Check additional categories
  if (business.additional_categories) {
    for (const category of business.additional_categories) {
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      if (categoriesCache!.some(cat => cat.slug.toLowerCase() === categorySlug)) {
        return category;
      }
    }
  }

  return null;
}

export async function generateBreadcrumbs(type: string, params: {
  category?: string;
  state?: string;
  city?: string;
  business?: string;
  searchOrigin?: {
    city: string;
    state: string;
    state_abbr: string;
    category?: string;
  } | undefined;
}): Promise<BreadcrumbConfig[]> {
  // Start with empty array - home icon is handled by the Breadcrumbs component
  const breadcrumbs: BreadcrumbConfig[] = [];

  switch (type) {
    case 'business':
      breadcrumbs.push({
        type: 'categories',
        label: 'Categories',
        href: '/categories',
        description: 'Browse all business categories'
      });

      // Only add category and location breadcrumbs if we have searchOrigin
      if (params.searchOrigin?.category) {
        const categorySlug = params.searchOrigin.category.toLowerCase().replace(/\s+/g, '-');
        if (await isValidCategory(categorySlug)) {
          breadcrumbs.push({
            type: 'category',
            label: formatCategoryName(params.searchOrigin.category),
            href: `/categories/${categorySlug}`,
            description: `Browse all ${params.searchOrigin.category} businesses`
          });

          // Add state breadcrumb if we have it
          if (params.searchOrigin.state) {
            const stateSlug = params.searchOrigin.state.toLowerCase();
            breadcrumbs.push({
              type: 'state',
              label: params.searchOrigin.state,
              href: `/categories/${categorySlug}/${stateSlug}`,
              description: `Browse ${params.searchOrigin.category} in ${params.searchOrigin.state}`
            });

            // Add city breadcrumb if we have it
            if (params.searchOrigin.city) {
              const citySlug = params.searchOrigin.city.toLowerCase().replace(/\s+/g, '-');
              const isValidLoc = await isValidLocation(params.searchOrigin.state, params.searchOrigin.city);
              if (isValidLoc) {
                breadcrumbs.push({
                  type: 'city',
                  label: params.searchOrigin.city,
                  href: `/categories/${categorySlug}/${stateSlug}/${citySlug}`,
                  description: `${params.searchOrigin.category} in ${params.searchOrigin.city}, ${params.searchOrigin.state}`
                });
              }
            }
          }
        }
      }

      // Add the business name as the final breadcrumb
      if (params.business) {
        breadcrumbs.push({
          type: 'business',
          label: params.business.length > 30 ? `${params.business.slice(0, 30)}...` : params.business,
          href: '#',
          description: `View ${params.business} details`
        });
      }
      break;

    case 'category-city':
      breadcrumbs.push({
        type: 'categories',
        label: 'Categories',
        href: '/categories',
        description: 'Browse all business categories'
      });

      if (params.category) {
        breadcrumbs.push({
          type: 'category',
          label: formatCategoryName(params.category),
          href: `/categories/${params.category}`,
          description: `Browse all ${params.category} businesses`
        });
      }

      if (params.state) {
        breadcrumbs.push({
          type: 'state',
          label: params.state.toUpperCase(),
          href: `/categories/${params.category}/${params.state.toLowerCase()}`,
          description: `Browse ${params.category} in ${params.state}`
        });
      }

      if (params.city && params.state) {
        breadcrumbs.push({
          type: 'city',
          label: params.city,
          href: `/categories/${params.category}/${params.state.toLowerCase()}/${params.city.toLowerCase().replace(/\s+/g, '-')}`,
          description: `${params.category} in ${params.city}, ${params.state}`
        });
      }
      break;

    case 'category':
      breadcrumbs.push({
        type: 'categories',
        label: 'Categories',
        href: '/categories',
        description: 'Browse all business categories'
      });
      if (params.category) {
        breadcrumbs.push({
          type: 'category',
          label: formatCategoryName(params.category),
          href: `/categories/${params.category}`,
          description: `Browse all ${params.category} businesses`
        });
      }
      break;

    case 'location':
      breadcrumbs.push({
        type: 'locations',
        label: 'Locations',
        href: '/locations',
        description: 'Browse all locations'
      });
      if (params.state) {
        breadcrumbs.push({
          type: 'state',
          label: params.state,
          href: `/locations/${params.state.toLowerCase()}`,
          description: `Browse businesses in ${params.state}`
        });
      }
      if (params.city) {
        breadcrumbs.push({
          type: 'city',
          label: params.city,
          href: `/locations/${params.state?.toLowerCase()}/${params.city.toLowerCase().replace(/\s+/g, '-')}`,
          description: `Browse businesses in ${params.city}, ${params.state}`
        });
      }
      break;
  }

  return breadcrumbs;
} 
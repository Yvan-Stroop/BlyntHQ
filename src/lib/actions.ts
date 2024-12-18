'use server'

import { loadCategoriesFromCSV, loadLocationsFromCSV } from './csv'
import { BreadcrumbConfig } from '@/types/breadcrumb'
import { formatCategoryName, normalizeUrlCity } from '@/lib/utils'
import { getStateAbbreviation } from '@/lib/locations'

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
  const normalizedStateAbbr = stateAbbr.trim().toUpperCase();
  const normalizedCity = normalizeUrlCity(city.trim());
  return locationsCache!.some(loc => 
    loc.state_abbr.toUpperCase() === normalizedStateAbbr && 
    normalizeUrlCity(loc.city) === normalizedCity
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
}): Promise<BreadcrumbConfig[]> {
  const breadcrumbs: BreadcrumbConfig[] = [{
    type: 'home',
    label: 'Home',
    href: '/',
    description: 'Return to homepage'
  }];

  switch (type) {
    case 'business':
      breadcrumbs.push({
        type: 'categories',
        label: 'Categories',
        href: '/categories',
        description: 'Browse all business categories'
      });

      // Add category breadcrumb if available
      if (params.category) {
        const categorySlug = params.category.toLowerCase().replace(/\s+/g, '-');
        if (await isValidCategory(categorySlug)) {
          breadcrumbs.push({
            type: 'category',
            label: formatCategoryName(params.category),
            href: `/categories/${categorySlug}`,
            description: `Browse all ${params.category} businesses`
          });

          // Add state breadcrumb if available
          if (params.state) {
            const stateAbbr = getStateAbbreviation(params.state.trim());
            if (stateAbbr) {
              breadcrumbs.push({
                type: 'state',
                label: stateAbbr.toUpperCase(),
                href: `/categories/${categorySlug}/${stateAbbr.toLowerCase()}`,
                description: `Browse ${params.category} in ${params.state.trim()}`
              });

              // Add city breadcrumb if available
              if (params.city) {
                const citySlug = normalizeUrlCity(params.city);
                const isValidLoc = await isValidLocation(stateAbbr, params.city);
                if (isValidLoc) {
                  breadcrumbs.push({
                    type: 'city',
                    label: params.city.trim(),
                    href: `/categories/${categorySlug}/${stateAbbr.toLowerCase()}/${citySlug}`,
                    description: `${params.category} in ${params.city.trim()}, ${params.state.trim()}`
                  });
                }
              }
            }
          }
        }
      }

      // Add business name as final breadcrumb
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
        const categorySlug = params.category.toLowerCase().replace(/\s+/g, '-');
        if (await isValidCategory(categorySlug)) {
          breadcrumbs.push({
            type: 'category',
            label: formatCategoryName(params.category),
            href: `/categories/${categorySlug}`,
            description: `Browse all ${params.category} businesses`
          });

          if (params.state) {
            breadcrumbs.push({
              type: 'state',
              label: params.state.toUpperCase(),
              href: `/categories/${categorySlug}/${params.state.toLowerCase()}`,
              description: `Browse ${params.category} in ${params.state}`
            });
          }

          if (params.city && params.state) {
            const isValidLoc = await isValidLocation(params.state, params.city);
            if (isValidLoc) {
              breadcrumbs.push({
                type: 'city',
                label: params.city,
                href: `/categories/${categorySlug}/${params.state.toLowerCase()}/${normalizeUrlCity(params.city)}`,
                description: `${params.category} in ${params.city}, ${params.state}`
              });
            }
          }
        }
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
        const categorySlug = params.category.toLowerCase().replace(/\s+/g, '-');
        if (await isValidCategory(categorySlug)) {
          breadcrumbs.push({
            type: 'category',
            label: formatCategoryName(params.category),
            href: `/categories/${categorySlug}`,
            description: `Browse all ${params.category} businesses`
          });
        }
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
      if (params.city && params.state) {
        const isValidLoc = await isValidLocation(params.state, params.city);
        if (isValidLoc) {
          breadcrumbs.push({
            type: 'city',
            label: params.city,
            href: `/locations/${params.state?.toLowerCase()}/${normalizeUrlCity(params.city)}`,
            description: `Browse businesses in ${params.city}, ${params.state}`
          });
        }
      }
      break;
  }

  return breadcrumbs;
} 
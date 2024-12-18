"use client"

import { CategoryHero } from '@/components/category/hero'
import { CategoryGuide } from '@/components/category/guide'
import { FeaturedBusinesses } from '@/components/category/featured'
import { RelatedCategories } from '@/components/category/related'
import { Category } from '@/lib/csv'
import type { LocationSearchProps } from '@/components/location-search'

export interface CategoryPageProps {
  category: Category;
  categories: Category[];
  state?: string;
  city?: string;
  content: {
    title: string;
    description: string;
    searchTips: string[];
    guide: any;
    featured: any;
  };
  states: LocationSearchProps['states'];
}

export function CategoryPage({ 
  category,
  categories,
  state,
  city,
  content,
  states
}: CategoryPageProps) {
  return (
    <div className="flex flex-col">
      <CategoryHero 
        category={category}
        categories={categories}
        states={states}
        content={content}
      />

      <div className="container px-4 py-16 md:py-24 space-y-16 md:space-y-24">
        <CategoryGuide 
          category={category}
          content={content.guide}
        />

        <FeaturedBusinesses 
          category={category}
          content={content.featured}
        />

        <RelatedCategories 
          currentCategory={category}
          allCategories={categories}
          state={state}
          city={city}
        />
      </div>
    </div>
  );
} 
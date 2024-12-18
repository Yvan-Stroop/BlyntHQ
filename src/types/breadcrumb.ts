import { ReactNode } from 'react';

export type BreadcrumbPath = 
  | 'home'
  | 'categories'
  | 'locations'
  | 'category'
  | 'state'
  | 'city'
  | 'business'
  | 'navigation';

export interface BreadcrumbConfig {
  type: BreadcrumbPath;
  label: string;
  href: string;
  description?: string;
  icon?: ReactNode;
} 
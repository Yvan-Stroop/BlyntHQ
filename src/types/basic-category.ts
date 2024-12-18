export interface Category {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    aliases?: string[];
    parentCategory?: string;
  } 
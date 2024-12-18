export interface CategoryService {
    name: string;
    description: string;
    typicalPrice?: string;
    priceRange?: {
      min: number;
      max: number;
    };
  }
  
  export interface CategoryCertification {
    name: string;
    description: string;
    importance: string;
  }
  
  export interface CategoryIndustryInfo {
    overview: string;
    considerations: string[];
    regulations?: string[];
  }
  
  export interface CategoryFAQ {
    question: string;
    answer: string;
    category?: string;
  }
  
  export interface CategoryDetails {
    name: string;
    slug: string;
    description: string;
    longDescription?: string;
    services: CategoryService[];
    certifications: CategoryCertification[];
    industryInfo: CategoryIndustryInfo;
    keywords: string[];
    relatedCategories: string[];
    faqs: CategoryFAQ[];
  }
  
  export interface CategoryDetailsMap {
    [key: string]: CategoryDetails;
  } 
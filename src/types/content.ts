export interface CategoryContent {
    title: string;
    description: string;
    searchTips: string[];
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
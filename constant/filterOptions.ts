// constants/filterOptions.ts

export const PRODUCT_STATUSES = ["live", "delay", "unavailable"] as const;
export type ProductStatus = typeof PRODUCT_STATUSES[number];

export const PRODUCT_TYPES = [
   "E-commerce",
   "Portfolio",
   "Business",
   "Personal-Blog",
   "Landing-Page",
   "SaaS",
   "Educational",
   "Real Estate",
   "Job-Portal",
   "Social-Network"
] as const;
export type ProductType = typeof PRODUCT_TYPES[number];

export interface FilterOptions {
   status?: ProductStatus;
   type?: ProductType;
}

export interface FilterOption {
   type: 'all' | 'productType';
   value: string;
   label: string;
}

export const productTypeFilters: FilterOption[] = [
   { type: 'productType', value: 'E-commerce', label: 'E-commerce' },
   { type: 'productType', value: 'Portfolio', label: 'Portfolio' },
   { type: 'productType', value: 'Business', label: 'Business' },
   { type: 'productType', value: 'Personal-Blog', label: 'Personal-Blog' },
   { type: 'productType', value: 'Landing-Page', label: 'Landing-Page' },
   { type: 'productType', value: 'SaaS', label: 'SaaS' },
   { type: 'productType', value: 'Educational', label: 'Educational' },
   { type: 'productType', value: 'Real Estate', label: 'Real Estate' },
   { type: 'productType', value: 'Job-Portal', label: 'Job-Portal' },
   { type: 'productType', value: 'Social-Network', label: 'Social-Network' }
];
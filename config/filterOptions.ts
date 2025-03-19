// constants/filterOptions.ts

export const PRODUCT_STATUSES = ["live", "delay", "unavailable"] as const;
export type ProductStatus = typeof PRODUCT_STATUSES[number];

export const PRODUCT_TYPES = [
   "E-commerce",
   "Portfolio",
   "Business",
   "Personal Blog",
   "Landing Page",
   "SaaS",
   "Educational",
   "Real Estate",
   "Job Portal",
   "Social Network"
] as const;
export type ProductType = typeof PRODUCT_TYPES[number];

export interface FilterOptions {
   status?: ProductStatus;
   type?: ProductType;
}
// ======================================================
// CATEGORY INTERFACES
// Interfaces related to category management and display
// ======================================================

/**
 * Data structure for creating or updating a category
 */
export interface CategoriesData {
   slug: string;
   title: string;
   subTitle: string;
   description: string;
   bannerImageUrl: string;
   bannerImageID: string;
   isFeatured: boolean;
   products: string[];
}

/**
 * Interface for category listings
 */
export interface ICategories {
   _id: string;
   title: string;
   subTitle: string;
   slug: string;
   isFeatured: boolean;
   createdAt: string;
   productsCount: number;
}

/**
 * Detailed category interface with additional fields
 */
export interface ICategory {
   _id: string;
   title: string;
   subTitle: string;
   slug: string;
   description?: string;
   bannerImageUrl?: string;
   bannerImageID?: string;
   isFeatured: boolean;
   createdAt: string;
   productsCount?: number;
}

// ======================================================
// PRODUCT INTERFACES
// Interfaces related to product data and display
// ======================================================

/**
 * Basic product listing interface
 */
export interface IProducts {
   _id: string;
   slug: string;
   title: string;
   productType: string;
   status: string;
   price: number;
}

/**
 * Complete product details interface
 */
export interface Product {
   _id: string;
   title: string;
   subTitle: string;
   price: number;
   tags: string[];
   images: { imageUrl: string }[];
   productAbout: string;
   technologyStack: string[];
   productType: string;
   websiteAge: number;
   liveLink?: string;
   status: string;
}

/**
 * Simplified product interface (used in listings or order summaries)
 */
export interface Product {
   _id: string;
   title: string;
   price: number;
   status: string;
}

/**
 * Product data for forms or API requests
 */
export interface ProductData {
   slug: string;
   title: string;
   subTitle: string;
   liveLink: string;
   productType: string;
   productAbout: string;
   tags: string[];
   _tagsInput: string;
   price: string;
   websiteAge: string;
   images: { imageUrl: string; imageId: string }[];
   bannerImageUrl: string;
   bannerImageID: string;
   technologyStack: string;
}

/**
 * Product card display properties
 */
export interface ProductCardProps {
   _id: string;
   slug: string;
   title: string;
   subTitle?: string;
   liveLink: string;
   productType: string;
   productAbout: string;
   technologyStack: [];
   price: number;
   websiteAge: number;
   status: string;
   images: [];
   bannerImageUrl: string;
   totalSold: number;
   totalRating: number;
   OfferStatus: string;
   OfferType: string;
   discount: number;
   rating: number;
   comment: string;
   isRatingFeatured: boolean;
   offerStartDate: string;
   offerEndDate: string;
}

// ======================================================
// USER INTERFACES
// Interfaces related to user data and authentication
// ======================================================

/**
 * Basic user information for admin dashboard
 */
export interface IUsers {
   _id: string;
   name: string;
   email: string;
   spent: string;
   createdAt: string;
   totalOrders: string;
}

/**
 * Complete user data with auth information
 */
export interface UserData {
   id: string;
   userId?: string;
   firstName: string;
   lastName: string;
   fullName: string;
   email: string;
   imageUrl: string;
   isAdmin: boolean;
   createdAt?: string;
   cart?: CartData;
}

// ======================================================
// CART AND ORDER INTERFACES
// Interfaces related to shopping cart and checkout
// ======================================================

/**
 * Product in cart
 */
export interface CartProduct {
   _id: string;
   title: string;
   price: number;
   bannerImageUrl: string;
}

/**
 * Complete cart data
 */
export interface CartData {
   id: string;
   totalAmount?: number;
   products: Array<{
      _id: string;
      title: string;
      price: number;
      bannerImageUrl: string;
   }>;
}

/**
 * Order summary component props
 */
export interface OrderSummaryProps {
   cartItems: CartProduct[];
   subtotal: number;
   tax: number;
   total: number;
   onCheckout: () => void;
   isLoading: boolean;
   isCheckingOut: boolean;
   discountCode?: string;
   discountAmount?: number;
}
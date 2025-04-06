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

export interface ProductsData {
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
   images: {
      imageUrl: string;
      imageId: string;
   }[];
   bannerImageUrl: string;
   bannerImageID: string;
   technologyStack: string | string[];
   [key: string]: string | string[] | { imageUrl: string; imageId: string; }[];
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
   tags?: string[];
   technologyStack: string[];
   price: number;
   websiteAge: number;
   status: string;
   images: {
      imageUrl: string;
      imageId: string;
      _id: string;
   }[];
   bannerImageUrl: string;
   bannerImageID?: string;
   is_featured?: boolean;
   totalSold: number;
   totalRating: number;
   rating: number;
   comment: string;
   isRatingFeatured: boolean;
   OfferStatus: string;
   OfferType: string;
   discount: number;
   offerStartDate: string;
   offerEndDate: string;
   createdAt?: string;
   updatedAt?: string;
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
   orders: string[];
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
   cart?: Cart;
}


// ======================================================
// CART AND ORDER INTERFACES
// Interfaces related to shopping cart and checkout
// ======================================================

export interface CartTotals {
   originalTotal: number;
   subtotal: number;
   tax: number;
   total: number;
   discountAmount: number;
}

export interface Cart {
   id: string;
   products: CartProductItem[];
}

export interface CartProductItem {
   _id: string;
   title: string;
   price: number;
   bannerImageUrl: string;
   OfferStatus: string;
   OfferType: string;
   discount: number;
   offerStartDate: string;
   offerEndDate: string;
}


/**
 * Product in cart
 */

export interface ProcessedCartItem extends CartProductItem {
   discountedPrice?: number;
   originalPrice?: number;
   isOfferActive?: boolean;
}

export interface CartTotals {
   originalTotal: number;
   subtotal: number;
   tax: number;
   total: number;
   discountAmount: number;
}

export interface OrderSummaryProps {
   cartItems: ProcessedCartItem[];
   subtotal: number;
   tax: number;
   total: number;
   discountAmount?: number;
   onCheckout: () => void;
   isLoading: boolean;
   isCheckingOut: boolean;
}

export interface OrderCreateData {
   owner: string;
   totalOriginalAmount: number;
   payableAmount: number;
   discountAmount: number;
   taxAmount: number
   subtotal: number
   products: string[]
}

export interface CartProduct {
   _id: string;
   title: string;
   price: number;
   bannerImageUrl: string;
   OfferStatus: string;
   OfferType: string;
   discount: number;
   offerStartDate: string;
   offerEndDate: string;
   discountedPrice?: number;
   originalPrice?: number;
   products: Product[];
}


/**
 * Order summary component props
 */

export interface OrderSummaryProps {
   cartItems: ProcessedCartItem[];
   subtotal: number;
   tax: number;
   total: number;
   onCheckout: () => void;
   isLoading: boolean;
   isCheckingOut: boolean;
   discountCode?: string;
   discountAmount?: number;
   promoCode?: string;
   setPromoCode?: (code: string) => void;
   onApplyPromo?: (e: React.FormEvent) => void;
}

// ======================================================
// OFFER
// Interfaces related to offer
// ======================================================

export interface OfferData {
   id?: string;
   OfferStatus: string;
   OfferType: string;
   discount: number;
   offerStartDate: string;
   offerEndDate: string;
   productId?: string;
}

export interface Offer {
   OfferStatus: string;
   OfferType: string;
   discount: number;
   offerStartDate: string;
   offerEndDate: string;
   productSlug: string;
}

// interfaces/OrderTypes.ts

// Product interface
export interface Product {
   _id: string;
   title: string;
   productType: string;
   price: number;
   OfferStatus: string;
   OfferType?: 'percentage' | 'fixed';
   discount?: number;
}

// Order interface
export interface Order {
   _id: string;
   owner: string;
   products: [
      {
         productId: string;
         title: string;
         productType: string;
         price: number;
         OfferStatus: string;
         OfferType: string;
         discount: number;
      }
   ];
   totalOriginalAmount: number;
   payableAmount: number;
   discountAmount: number;
   taxAmount: number;
   subtotal: number;
   status: "pending" | "processing" | "completed" | "cancelled";
   paymentStatus: "pending" | "processing" | "completed" | "cancelled";
   orderDate: string;
   trackId: string;
   invoiceId: string;
   createdAt: string;
   updatedAt: string;
   __v: number;
}

// Props interface for OrderCard component
export interface OrderCardProps {
   orders: Order[];
}


// rating 
export interface Rating {
   rating: number;
   comment: string;
   productIds: string[];
   orderId: string;
}
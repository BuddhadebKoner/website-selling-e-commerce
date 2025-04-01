import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { getAllProducts, getProductBySlug, getProductsByStatus, getProductsByType } from "@/endpoints/products.api";
import { getAllCategory, getCategoryBySlug } from "@/endpoints/category.api";
import { getAllUsers, isAuthCheck } from "@/endpoints/user.api";
import { getOrderListById } from "@/endpoints/order.api";
import { getAllOffers } from "@/endpoints/offer.api";
import { getOrderByStatus } from "@/endpoints/admin.api";

export const useGetIsAuthCheck = (clerkId: string, email: string, fullName: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.IS_AUTH_CHECK, clerkId],
      queryFn: () => isAuthCheck({ clerkId, email, fullName }),
      enabled: !!clerkId,
   });
};

export const useGetAllProducts = (limit = 5) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_ALL_PRODUCTS, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getAllProducts(pageParam, limit),
      getNextPageParam: (lastPage) => {
         if ('error' in lastPage) return undefined;
         if (lastPage.currentPage < lastPage.totalPages) {
            return lastPage.currentPage + 1;
         }
         return undefined;
      },
      staleTime: 1000 * 60 * 5,
   });
};

export const useGetProductsByType = (productType: string, limit = 5, options: { enabled?: boolean } = {}) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_PRODUCTS_BY_TYPE, productType, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getProductsByType(productType, pageParam, limit),
      getNextPageParam: (lastPage) => {
         if ('error' in lastPage) return undefined;
         if (lastPage.currentPage < lastPage.totalPages) {
            return lastPage.currentPage + 1;
         }
         return undefined;
      },
      // Skip the query if no product type is provided
      enabled: !!productType && (options.enabled !== false),
      staleTime: 1000 * 60 * 5,
      ...options,
   });
};

export const useGetProductsByStatus = (status: string, limit = 5, options: { enabled?: boolean } = {}) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_PRODUCTS_BY_STATUS, status, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getProductsByStatus(status, pageParam, limit),
      getNextPageParam: (lastPage) => {
         if ('error' in lastPage) return undefined;
         if (lastPage.currentPage < lastPage.totalPages) {
            return lastPage.currentPage + 1;
         }
         return undefined;
      },
      // Skip the query if no status is provided
      enabled: !!status && (options.enabled !== false),
      staleTime: 1000 * 60 * 5, // 5 minutes
      ...options,
   });
};

// get product by slug 
export const useGetProductBySlug = (slug: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_PRODUCT_BY_SLUG, slug],
      queryFn: () => getProductBySlug(slug),
      enabled: !!slug,
      staleTime: 1000 * 60 * 5,
   });
};

// get category bu slug
export const useGetCategoryBySlug = (slug: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_CATEGORY_BY_SLUG, slug],
      queryFn: () => getCategoryBySlug(slug),
      enabled: !!slug,
      staleTime: 1000 * 60 * 5,
   });
};

// infinityscroll users
export const useGetAllUsers = (limit = 10) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_ALL_USERS, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getAllUsers(pageParam, limit),
      getNextPageParam: (lastPage) => {
         // Handle error case
         if ('error' in lastPage) {
            return undefined;
         }

         if (lastPage.currentPage < lastPage.totalPages) {
            return lastPage.currentPage + 1;
         }
         return undefined;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
   });
};

// get all category
export const useGetAllCategory = (limit = 10, options = {}) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_ALL_CATEGORY, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getAllCategory(pageParam, limit),
      getNextPageParam: (lastPage) => {
         if ('error' in lastPage) return undefined;
         if (lastPage.currentPage < lastPage.totalPages) {
            return lastPage.currentPage + 1;
         }
         return undefined;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      ...options,
   });
};


export const useGetOrdersListByUserId = (userId: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_ORDERS_BY_USER_ID, userId],
      queryFn: () => getOrderListById(userId),
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
   });
};

export const useGetOrderByTrackId = (trackId: string) => {

};

// React Query hook using useInfiniteQuery
export const useGetAllOffers = (limit = 10) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_ALL_OFFERS, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) => getAllOffers({ page: pageParam, limit }),
      getNextPageParam: (lastPage) => {
         if ('error' in lastPage) return undefined;
         if (lastPage.currentPage < lastPage.totalPages) {
            return lastPage.currentPage + 1;
         }
         return undefined;
      },
      staleTime: 1000 * 60 * 5,
   });
};

// get all orders based upon status
export const useGetAllOrdersByStatus = (status: string) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_ALL_ORDERS_BY_STATUS, status],
      queryFn: () => getOrderByStatus(status),
      enabled: !!status,
      staleTime: 1000 * 60 * 5,
   });
 }
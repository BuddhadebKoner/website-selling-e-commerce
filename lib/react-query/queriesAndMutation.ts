import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { getAllProducts, getLiveProducts, getDelayedProducts, getUnavailableProducts } from "@/endpoints/products";
import { getAllUsers } from "@/endpoints/admin.api";

// Original infinite scroll for all products
export const useGetAllProducts = (limit = 10, options = {}) => {
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
      refetchOnWindowFocus: false,
      ...options,
   });
};

// Live products infinite scroll
export const useGetLiveProducts = (limit = 10) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_LIVE_PRODUCTS, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getLiveProducts(pageParam, limit),
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
      refetchOnWindowFocus: false,
   });
};

// Delayed products infinite scroll
export const useGetDelayedProducts = (limit = 10) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_DELAYED_PRODUCTS, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getDelayedProducts(pageParam, limit),
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
      refetchOnWindowFocus: false,
   });
};

// Unavailable products infinite scroll
export const useGetUnavailableProducts = (limit = 10) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_UNAVAILABLE_PRODUCTS, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getUnavailableProducts(pageParam, limit),
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
      refetchOnWindowFocus: false,
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
      refetchOnWindowFocus: false,
   });
};
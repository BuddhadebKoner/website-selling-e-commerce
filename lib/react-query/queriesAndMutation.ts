import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { getAllProducts } from "@/endpoints/products";
import { getAllUsers } from "@/endpoints/admin.api";

// infinityscroll
export const useGetAllProducts = (limit = 10) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_ALL_PRODUCTS, limit],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getAllProducts(pageParam, limit),
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
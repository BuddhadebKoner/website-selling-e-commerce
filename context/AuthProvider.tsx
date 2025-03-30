"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { UserData } from "@/types/interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useGetIsAuthCheck } from "@/lib/react-query/queriesAndMutation";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

interface AuthContextType {
   currentUser: UserData | null;
   isLoading: boolean;
   isAdmin: boolean;
   refreshUser: () => Promise<void>;
   refreshCurrentUser: () => Promise<void>;
}

// Create context with proper typing
export const AuthContext = createContext<AuthContextType>({
   currentUser: null,
   isLoading: true,
   isAdmin: false,
   refreshUser: async () => { },
   refreshCurrentUser: async () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [currentUser, setCurrentUser] = useState<UserData | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const { user, isLoaded } = useUser();
   const queryClient = useQueryClient();

   // Function to check if user is admin - memoized to avoid recalculation
   const checkIfAdmin = useCallback((metadata: any): boolean => {
      return metadata?.role === 'master';
   }, []);

   // Only enable the query when we have the necessary user data
   const {
      data: authCheckData,
      isLoading: isAuthCheckLoading,
      refetch: refetchAuthCheck
   } = useGetIsAuthCheck(
      user?.id || "",
      user?.primaryEmailAddress?.emailAddress || "",
      user?.fullName || ""
   );

   // Prepare user data function
   const prepareUserData = useCallback(() => {
      if (!user) return null;

      return {
         id: user.id,
         firstName: user.firstName || '',
         lastName: user.lastName || '',
         fullName: user.fullName || '',
         email: user.primaryEmailAddress?.emailAddress || '',
         imageUrl: user.imageUrl || '',
         createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : '',
         isAdmin: checkIfAdmin(user.publicMetadata),
         userId: authCheckData?.data?.id,
         cart: authCheckData?.data?.cart
      };
   }, [user, authCheckData, checkIfAdmin]);

   // Update current user whenever authCheckData changes
   useEffect(() => {
      if (isLoaded && user && authCheckData?.data) {
         const userData = prepareUserData();
         setCurrentUser(userData);
         setIsLoading(false);
      } else if (isLoaded && !user) {
         setCurrentUser(null);
         setIsLoading(false);
      }
   }, [isLoaded, user, authCheckData, prepareUserData]);

   // Set loading state based on Clerk and our auth check
   useEffect(() => {
      setIsLoading(!isLoaded || isAuthCheckLoading);
   }, [isLoaded, isAuthCheckLoading]);

   // More efficient refreshUser that leverages query client
   const refreshUser = useCallback(async () => {
      if (!user) {
         setCurrentUser(null);
         setIsLoading(false);
         return;
      }

      try {
         // Only set loading if we don't already have cached data
         const cachedData = queryClient.getQueryData([QUERY_KEYS.IS_AUTH_CHECK, user.id]);
         if (!cachedData) setIsLoading(true);

         // Use the refetch function from React Query
         const result = await refetchAuthCheck();

         // Only update user state if we got valid data
         if (result.data?.data) {
            const userData = prepareUserData();
            setCurrentUser(userData);
         }
      } catch (error) {
         console.error("Error refreshing user:", error);
      } finally {
         setIsLoading(false);
      }
   }, [user, queryClient, refetchAuthCheck, prepareUserData]);

   // RefreshCurrentUser function - always force-fetches fresh data
   const refreshCurrentUser = useCallback(async () => {
      if (!user) {
         setCurrentUser(null);
         setIsLoading(false);
         return;
      }

      try {
         setIsLoading(true);

         // Invalidate the existing query data to ensure a fresh fetch
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.IS_AUTH_CHECK, user.id],
         });

         // Fetch fresh data
         const result = await refetchAuthCheck();

         // Only update user state if we got valid data
         if (result.data?.data) {
            const userData = prepareUserData();
            setCurrentUser(userData);
         }
      } catch (error) {
         console.error("Error refreshing current user:", error);
      } finally {
         setIsLoading(false);
      }
   }, [user, queryClient, refetchAuthCheck, prepareUserData]);

   // Memoize isAdmin to avoid recalculations
   const isAdmin = useMemo(() => currentUser?.isAdmin || false, [currentUser]);

   // Memoize context value to prevent unnecessary re-renders
   const contextValue = useMemo(() => ({
      currentUser,
      isLoading,
      isAdmin,
      refreshUser,
      refreshCurrentUser
   }), [currentUser, isLoading, isAdmin, refreshUser, refreshCurrentUser]);

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
}

// Create a custom hook for easy access to auth context
export const useUserAuthentication = () => useContext(AuthContext);
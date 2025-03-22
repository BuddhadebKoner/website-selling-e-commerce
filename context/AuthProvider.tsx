"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { isAuthCheck } from "@/endpoints/user.api";
import { UserData } from "@/types/interfaces";


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
   const [lastCheckedUserId, setLastCheckedUserId] = useState<string | null>(null);
   const { user, isLoaded } = useUser();

   // Function to check if user is admin - memoized to avoid recalculation
   const checkIfAdmin = useCallback((metadata: any): boolean => {
      return metadata?.role === 'master';
   }, []);

   const checkUserExist = useCallback(async (clerkId: string, email: string, fullName: string) => {
      try {
         // Avoid duplicate API calls for the same user
         if (lastCheckedUserId === clerkId && currentUser) {
            return { success: true };
         }
         const res = await isAuthCheck({ clerkId, email, fullName });
         // console.log("isAuthCheck response:", res);
         if (!res.error && res.data) {
            setLastCheckedUserId(clerkId);
         }
         return res;
      } catch (error) {
         console.error("Error in checkUserExist:", error);
         return { error: "Internal Server Error" };
      }
   }, [lastCheckedUserId, currentUser]);

   const refreshUser = useCallback(async () => {
      if (!user) {
         setCurrentUser(null);
         setIsLoading(false);
         return;
      }

      try {
         setIsLoading(true);

         const userData: UserData = {
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            fullName: user.fullName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
            imageUrl: user.imageUrl || '',
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : '',
            isAdmin: checkIfAdmin(user.publicMetadata)
         };

         // Check user existence only if we haven't already done so for this user
         if (lastCheckedUserId !== user.id) {
            const res = await checkUserExist(userData.id, userData.email, userData.fullName);
            userData.userId = res.data.id;
            if (!res.error && res.data) {
               userData.cart = res.data.cart;
            } else {
               console.error("Error in checkUserExist:", res.error);
               // Optionally, you might decide to clear userData or leave it as is.
            }
         }
         // Update state with the latest user data
         setCurrentUser(userData);
      } catch (error) {
         console.error("Error refreshing user:", error);
         setCurrentUser(null);
      } finally {
         setIsLoading(false);
      }
   }, [user, checkIfAdmin, checkUserExist, lastCheckedUserId]);

   // Add this new function
   const refreshCurrentUser = useCallback(async () => {
      if (!user) {
         setCurrentUser(null);
         setIsLoading(false);
         return;
      }

      try {
         setIsLoading(true);

         const userData: UserData = {
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            fullName: user.fullName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
            imageUrl: user.imageUrl || '',
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : '',
            isAdmin: checkIfAdmin(user.publicMetadata)
         };

         // Always fetch fresh data from API, regardless of lastCheckedUserId
         const res = await isAuthCheck({ 
            clerkId: userData.id, 
            email: userData.email, 
            fullName: userData.fullName 
         });
         
         if (!res.error && res.data) {
            userData.userId = res.data.id;
            userData.cart = res.data.cart;
            setLastCheckedUserId(user.id);
         } else {
            console.error("Error in refreshCurrentUser:", res.error);
         }
         
         // Update state with the latest user data
         setCurrentUser(userData);
      } catch (error) {
         console.error("Error refreshing current user:", error);
         setCurrentUser(null);
      } finally {
         setIsLoading(false);
      }
   }, [user, checkIfAdmin]);

   // Only run effect when isLoaded or user changes
   useEffect(() => {
      if (isLoaded) {
         // Skip refreshing if the user is the same as the last checked
         if (!user || user.id !== lastCheckedUserId) {
            refreshUser();
         }
      }
   }, [isLoaded, user, refreshUser, lastCheckedUserId]);

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

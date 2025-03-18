"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { isAuthCheck } from "@/endpoints/user.api";

interface UserData {
   id: string;
   firstName: string;
   lastName: string;
   fullName: string;
   email: string;
   imageUrl: string;
   isAdmin: boolean;
   createdAt?: string;
}

interface AuthContextType {
   currentUser: UserData | null;
   isLoading: boolean;
   isAdmin: boolean;
   refreshUser: () => Promise<void>;
}

// Create context with proper typing
export const AuthContext = createContext<AuthContextType>({
   currentUser: null,
   isLoading: true,
   isAdmin: false,
   refreshUser: async () => { }
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

   // Check in database if user exists - memoized with proper caching
   const checkUserExist = useCallback(async (clerkId: string, email: string, fullName: string) => {
      try {
         // Don't make API call if we've already checked this user recently
         if (lastCheckedUserId === clerkId && currentUser) {
            return { success: true };
         }

         const res = await isAuthCheck({ clerkId, email, fullName });
         if (!res.error) {
            setLastCheckedUserId(clerkId);
         }
         return res;
      } catch (error) {
         console.error("Error in checkUserExist:", error);
         return { error: "Internal Server Error" };
      }
   }, [lastCheckedUserId, currentUser]);

   // Function to refresh user data - memoized to maintain reference equality
   const refreshUser = useCallback(async () => {
      if (!user) {
         setCurrentUser(null);
         setIsLoading(false);
         return;
      }

      try {
         setIsLoading(true);

         // Create userData object once
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

         // Only check user existence if we haven't checked this user yet
         if (lastCheckedUserId !== user.id) {
            const res = await checkUserExist(userData.id, userData.email, userData.fullName);
            if ('error' in res && res.error) {
               console.error("Error in checkUserExist:", res.error);
               setCurrentUser(null);
            } else {
               setCurrentUser(userData);
            }
         } else {
            // If we've already verified this user, just update the data
            setCurrentUser(userData);
         }
      } catch (error) {
         console.error("Error refreshing user:", error);
         setCurrentUser(null);
      } finally {
         setIsLoading(false);
      }
   }, [user, checkIfAdmin, checkUserExist, lastCheckedUserId]);

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
      refreshUser
   }), [currentUser, isLoading, isAdmin, refreshUser]);

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
}

// Create a custom hook for easy access to auth context
export const useUserAuthentication = () => useContext(AuthContext);
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
   const { user, isLoaded } = useUser();

   // Function to check if user is admin
   const checkIfAdmin = (metadata: any): boolean => {
      console.log("metadata:", metadata);
      return metadata?.role === 'master';
   };

   // Check in database if user exists
   const checkUserExist = async (clerkId: string, email: string, fullName: string) => {
      try {
         const res = await isAuthCheck({ clerkId, email, fullName });
         return res;
      } catch (error) {
         console.error("Error in checkUserExist:", error);
         return { error: "Internal Server Error" };
      }
   };

   // Function to refresh user data
   const refreshUser = async () => {
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

         const res = await checkUserExist(userData.id, userData.email, userData.fullName);

         if (res.error) {
            console.error("Error in checkUserExist:", res.error);
            setCurrentUser(null);
         } else {
            setCurrentUser(userData);
         }
      } catch (error) {
         console.error("Error refreshing user:", error);
         setCurrentUser(null);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (isLoaded) {
         refreshUser();
      }
   }, [isLoaded, user]);

   // The actual admin status based on current user
   const isAdmin = currentUser?.isAdmin || false;

   return (
      <AuthContext.Provider value={{ currentUser, isLoading, isAdmin, refreshUser }}>
         {children}
      </AuthContext.Provider>
   );
}

// Create a custom hook for easy access to auth context
export const useUserAuthentication = () => useContext(AuthContext);
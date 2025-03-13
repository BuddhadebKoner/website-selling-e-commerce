"use client"

import { useUser } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect } from "react";

// Define types for better type safety
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
}

// Create context with proper typing
export const AuthContext = createContext<AuthContextType>({
   currentUser: null,
   isLoading: true,
   isAdmin: false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [currentUser, setCurrentUser] = React.useState<UserData | null>(null);
   const [isLoading, setIsLoading] = React.useState(true);
   const { user, isLoaded } = useUser();

   useEffect(() => {
      if (isLoaded) {
         if (user) {
            // Extract only the important user data for security
            const userData: UserData = {
               id: user.id,
               firstName: user.firstName || '',
               lastName: user.lastName || '',
               fullName: user.fullName || '',
               email: user.primaryEmailAddress?.emailAddress || '',
               imageUrl: user.imageUrl || '',
               createdAt: user.createdAt ? user.createdAt.toISOString() : '',
               // Check if user is admin based on metadata
               isAdmin: checkIfAdmin(user.publicMetadata)
            };

            setCurrentUser(userData);
         } else {
            setCurrentUser(null);
         }

         setIsLoading(false);
      }
   }, [isLoaded, user]);

   // Function to check if user is admin
   const checkIfAdmin = (metadata: any): boolean => {
      // You can set different conditions for admin status based on metadata
      return metadata?.feature === 'master';
   }

   // The actual admin status based on current user
   const isAdmin = currentUser?.isAdmin || false;

   return (
      <AuthContext.Provider value={{ currentUser, isLoading, isAdmin }}>
         {children}
      </AuthContext.Provider>
   );
}

// Create a custom hook for easy access to auth context
export const useUserAuthentication = () => useContext(AuthContext);
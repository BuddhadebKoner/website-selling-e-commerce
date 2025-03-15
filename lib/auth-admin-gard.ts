// lib/auth-admin-gard.ts
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to protect admin routes based on user metadata
 * Works with the existing context API authentication logic
 */
export async function adminGuard(req: NextRequest) {
   const { userId } = getAuth(req);

   // No user authenticated
   if (!userId) {
      return NextResponse.json(
         { success: false, message: "Authentication required" },
         { status: 401 }
      );
   }

   try {
      // Get user from Clerk to check metadata
      const client = await clerkClient();
      const user = await client.users.getUser(userId);

      // Apply the same admin check logic as in your context
      // Looking for feature: 'master' in publicMetadata
      const isAdmin = user.publicMetadata?.feature === 'master';

      if (!isAdmin) {
         return NextResponse.json(
            { success: false, message: "Admin access required" },
            { status: 403 }
         );
      }

      // User is authorized as admin
      return null;

   } catch (error) {
      console.error("Admin authorization error:", error);
      return NextResponse.json(
         { success: false, message: "Error verifying admin status" },
         { status: 500 }
      );
   }
}

/**
 * Helper function to verify if the current request is from an admin
 * Returns boolean instead of response
 */
export async function isAdminRequest(req: NextRequest): Promise<boolean> {
   const { userId } = getAuth(req);

   if (!userId) return false;

   try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      return user.publicMetadata?.role === 'master';
   } catch {
      return false;
   }
}
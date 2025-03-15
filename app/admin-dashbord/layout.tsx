"use client"

import {
   Bell,
   Search,
   LogOut,
   ShieldAlert,
   Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import DashbordSidebar from '@/components/DashbordSidebar'
import { useUserAuthentication } from '@/context/AuthProvider'
import { useEffect, useState } from 'react'

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
   const navigate = useRouter()
   const { currentUser, isAdmin, isLoading, refreshUser } = useUserAuthentication()
   const [lastActivity, setLastActivity] = useState<number>(Date.now())
   const [notificationCount, setNotificationCount] = useState<number>(3)

   // Handle session timeout
   useEffect(() => {
      const resetTimer = () => setLastActivity(Date.now())
      const checkActivity = () => {
         if (Date.now() - lastActivity > SESSION_TIMEOUT) {
            // Session expired
            alert("Your session has expired due to inactivity. Please log in again.")
            // Redirect to login page
            navigate.push('/')
         }
      }

      // Add event listeners to track user activity
      window.addEventListener('mousemove', resetTimer)
      window.addEventListener('keypress', resetTimer)
      window.addEventListener('click', resetTimer)

      // Check session status every minute
      const interval = setInterval(checkActivity, 60000)

      return () => {
         window.removeEventListener('mousemove', resetTimer)
         window.removeEventListener('keypress', resetTimer)
         window.removeEventListener('click', resetTimer)
         clearInterval(interval)
      }
   }, [lastActivity, navigate])

   // Redirect unauthorized users after short delay
   useEffect(() => {
      if (!isLoading && (!currentUser || !isAdmin)) {
         const timer = setTimeout(() => {
            navigate.push('/')
         }, 2000)
         return () => clearTimeout(timer)
      }
   }, [currentUser, isAdmin, isLoading, navigate])

   if (isLoading) {
      return (
         <div className="w-full h-screen flex items-center justify-center bg-background">
            <div className="text-center">
               <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
               <h2 className="mt-4 text-xl font-semibold">Loading Admin Dashboard...</h2>
               <p className="mt-2 text-muted-foreground">Please wait while we verify your credentials</p>
            </div>
         </div>
      )
   }

   if (!currentUser || !isAdmin) {
      return (
         <div className="w-full h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8 border border-red-300 rounded-lg bg-red-50 max-w-md">
               <ShieldAlert className="h-16 w-16 text-red-500 mx-auto" />
               <h2 className="mt-4 text-2xl font-bold text-red-700">Access Denied</h2>
               <p className="mt-2 text-muted-foreground">
                  You don't have permission to access the admin dashboard.
                  Redirecting to login page...
               </p>
            </div>
         </div>
      )
   }

   return (
      <div className="w-full flex h-[85vh] bg-background relative overflow-hidden">
         {/* Sidebar */}
         <DashbordSidebar />
         {/* Main content */}
         <main className="flex-1 flex flex-col w-full">
            {/* Header */}
            <header className="bg-glass sticky top-0 z-10 flex items-center justify-between p-4 shadow-sm">
               <div className="relative max-w-xs flex items-center bg-background-secondary w-full rounded-md">
                  <button
                     className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                     aria-label="Search"
                  >
                     <Search className="w-5 h-5 text-primary" />
                  </button>
                  <input
                     type="text"
                     placeholder="Search..."
                     className="w-full p-2 bg-transparent border-none focus:outline-none"
                  />
               </div>

               <div className='flex items-center space-x-4'>
                  <div className="relative">
                     <button
                        onClick={() => navigate.push('/admin-dashbord/notifications')}
                        className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer">
                        <Bell className="w-5 h-5 text-primary" />
                        {notificationCount > 0 && (
                           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {notificationCount}
                           </span>
                        )}
                     </button>
                  </div>

                  <div className="flex items-center space-x-3">
                     {currentUser?.imageUrl && (
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                           <Image
                              src={currentUser.imageUrl}
                              alt="Profile"
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                           />
                        </div>
                     )}
                     <div className="hidden md:block">
                        <p className="text-sm font-medium">{currentUser?.fullName}</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                     </div>
                  </div>
               </div>
            </header>

            {/* Dashboard content */}
            <div className="p-4 md:p-6 overflow-auto flex-1">
               {children}
            </div>
         </main>
      </div>
   )
}
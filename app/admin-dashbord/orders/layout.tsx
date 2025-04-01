"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function OrdersLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const pathname = usePathname()

   const isActive = (path: string) => {
      if (path === "/admin-dashbord/orders" && pathname === "/admin-dashbord/orders") {
         return true
      }
      return pathname.includes(path) && path !== "/admin-dashbord/orders"
   }

   const getLinkClass = (path: string) => {
      return isActive(path)
         ? "btn bg-highlight-primary text-white"
         : "btn btn-secondary"
   }

   return (
      <>
         <div className="flex space-x-2 mb-4">
            <Link
               href={"/admin-dashbord/orders"}
               className={getLinkClass("/admin-dashbord/orders")}>
               All Orders
            </Link>
            <Link
               href={"/admin-dashbord/orders/pending"}
               className={getLinkClass("/admin-dashbord/orders/pending")}>
               Pending
            </Link>
            <Link
               href={"/admin-dashbord/orders/processing"}
               className={getLinkClass("/admin-dashbord/orders/processing")}>
               Processing
            </Link>
            <Link
               href={"/admin-dashbord/orders/completed"}
               className={getLinkClass("/admin-dashbord/orders/completed")}>
               Completed
            </Link>
            <Link
               href={"/admin-dashbord/orders/cancelled"}
               className={getLinkClass("/admin-dashbord/orders/cancelled")}>
               Cancelled
            </Link>
         </div>
         <div>
            {children}
         </div>
      </>
   )
}
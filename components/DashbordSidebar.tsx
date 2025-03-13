import { BarChart, ChartColumnStacked, Package, Settings, ShoppingBag, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const DashbordSidebar = () => {
   return (
      <aside className="fixed lg:static z-20 h-full w-64 bg-background-secondary border-r border-theme transition-all duration-300">
         <div className="p-6">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
         </div>
         <nav className="mt-6 flex flex-col min-h-screen">
            <div className="flex-1">
               <SidebarLink
                  icon={<BarChart size={20} />}
                  label="Overview"
                  href="/admin-dashbord"
                  active={true}
               />
               <SidebarLink
                  icon={<ShoppingBag size={20} />}
                  label="Products"
                  href="/admin-dashbord/products"
                  active={false}
               />
               <SidebarLink
                  icon={<Users size={20} />}
                  label="Customers"
                  href="/admin-dashbord/customers"
                  active={false}
               />
               <SidebarLink
                  icon={<Package size={20} />}
                  label="Orders"
                  href="/admin-dashbord/orders"
                  active={false}
               />
               <SidebarLink
                  icon={<ChartColumnStacked size={20} />}
                  label="Categories"
                  href="/admin-dashbord/categories"
                  active={false}
               />
               <SidebarLink
                  icon={<Settings size={20} />}
                  label="Settings"
                  href="/admin-dashbord/settings"
                  active={false}
               />
            </div>
         </nav>
      </aside>
   )
}

export default DashbordSidebar



// Sidebar link component
function SidebarLink({ icon, label, active, href }: { icon: React.ReactNode, label: string, active: boolean, href: string }) {
   return (
      <Link
         href={href}
         className={`flex items-center w-full px-6 py-3 transition-colors ${active
            ? 'bg-accent text-highlight'
            : 'text-secondary hover:bg-background hover:text-primary'
            }`}
      >
         <span className="mr-3">{icon}</span>
         <span>{label}</span>
      </Link>
   )
}
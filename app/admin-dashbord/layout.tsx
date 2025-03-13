import {
   Bell,
   Search,
} from 'lucide-react'
import DashbordSidebar from '@/components/DashbordSidebar'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {

   return (
      <div className="w-full flex h-[85vh] bg-background relative overflow-hidden">
         {/* Sidebar */}
         <DashbordSidebar />
         {/* Main content */}
         <main className="flex-1 flex flex-col w-full">
            {/* Header */}
            <header className="bg-glass sticky top-0 z-10 flex items-center justify-between p-4 shadow-sm">
               <div className="relative max-w-xs flex items-center bg-background-secondary w-full rounded-md ">
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
                  <button className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer">
                     <Bell className="w-5 h-5 text-primary" />
                  </button>
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

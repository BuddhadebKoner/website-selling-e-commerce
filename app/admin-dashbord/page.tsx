
import Link from 'next/link'
import {
   DollarSign,
   ShoppingBag,
   Users,
   Package
} from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { OrderRow } from '@/components/OrderRow'
import { ProductCard } from '@/components/ProductCard'

export default async function page() {

   return (
      <div className="w-full space-y-6 animate-fadeIn">
         <h2 className="text-2xl font-bold">Dashboard Overview</h2>

         {/* Stats cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
               icon={<DollarSign className="text-accent-green" size={24} />}
               title="Total Revenue"
               value="$24,512.00"
               change="+12.5%"
               positive={true}
            />
            <StatCard
               icon={<ShoppingBag className="text-accent-yellow" size={24} />}
               title="Total Orders"
               value="1,248"
               change="+8.2%"
               positive={true}
            />
            <StatCard
               icon={<Users className="text-highlight-primary" size={24} />}
               title="Total Customers"
               value="3,842"
               change="+5.4%"
               positive={true}
            />
            <StatCard
               icon={<Package className="text-highlight-secondary" size={24} />}
               title="Pending Orders"
               value="42"
               change="-2.5%"
               positive={false}
            />
         </div>

         {/* Recent orders */}
         <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Recent Orders</h3>
               <Link href="/admin-dashbord/orders" className="text-highlight-primary hover:text-highlight">
                  View all
               </Link>
            </div>
            <div className="bg-box rounded-lg overflow-hidden border border-theme">
               <table className="w-full">
                  <thead className="bg-background-secondary">
                     <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     <OrderRow
                        id="#ORD-1082"
                        customer="John Smith"
                        date="Mar 12, 2025"
                        amount="$125.00"
                        status="Delivered"
                        statusColor="accent-green"
                     />
                     <OrderRow
                        id="#ORD-1081"
                        customer="Lisa Johnson"
                        date="Mar 11, 2025"
                        amount="$245.99"
                        status="Processing"
                        statusColor="accent-yellow"
                     />
                     <OrderRow
                        id="#ORD-1080"
                        customer="Ryan Cooper"
                        date="Mar 10, 2025"
                        amount="$89.50"
                        status="Shipped"
                        statusColor="highlight-primary"
                     />
                     <OrderRow
                        id="#ORD-1079"
                        customer="Emma Wilson"
                        date="Mar 10, 2025"
                        amount="$312.75"
                        status="Delivered"
                        statusColor="accent-green"
                     />
                     <OrderRow
                        id="#ORD-1078"
                        customer="Michael Davis"
                        date="Mar 09, 2025"
                        amount="$78.25"
                        status="Cancelled"
                        statusColor="accent-red"
                     />
                  </tbody>
               </table>
            </div>
         </div>

         {/* Top selling products */}
         <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-bold">Top Selling Products</h3>
               <Link href="/admin-dashbord/products" className="text-highlight-primary hover:text-highlight">
                  View all
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               products
            </div>
         </div>
      </div>
   )
}
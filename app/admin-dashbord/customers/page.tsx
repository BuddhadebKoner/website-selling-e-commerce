'use client'

export default function CustomersPage() {
   return (
      <div className="space-y-6 animate-fadeIn">
         <h2 className="text-2xl font-bold">Customers</h2>

         <div className="bg-box rounded-lg overflow-hidden border border-theme">
            <table className="w-full">
               <thead className="bg-background-secondary">
                  <tr>
                     <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                     <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                     <th className="px-4 py-3 text-left text-sm font-medium">Spent</th>
                     <th className="px-4 py-3 text-left text-sm font-medium">Orders</th>
                     <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                  </tr>
               </thead>
               <tbody>
                  {[
                     { name: "John Smith", email: "john.smith@example.com", spent: "$894.30", orders: 8, joined: "Jan 12, 2025" },
                     { name: "Lisa Johnson", email: "lisa.johnson@example.com", spent: "$1,243.75", orders: 12, joined: "Feb 03, 2025" },
                     { name: "Ryan Cooper", email: "ryan.cooper@example.com", spent: "$548.25", orders: 6, joined: "Dec 18, 2024" },
                     { name: "Emma Wilson", email: "emma.wilson@example.com", spent: "$2,154.60", orders: 18, joined: "Nov 05, 2024" },
                     { name: "Michael Davis", email: "michael.davis@example.com", spent: "$378.40", orders: 4, joined: "Feb 22, 2025" },
                     { name: "Sarah Lee", email: "sarah.lee@example.com", spent: "$765.15", orders: 7, joined: "Jan 30, 2025" },
                     { name: "David Brown", email: "david.brown@example.com", spent: "$1,842.90", orders: 15, joined: "Oct 14, 2024" },
                     { name: "Jennifer Miller", email: "jennifer.miller@example.com", spent: "$429.85", orders: 5, joined: "Feb 11, 2025" },
                  ].map((customer, i) => (
                     <tr key={i} className="border-t border-theme">
                        <td className="px-4 py-3">
                           <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-background-secondary flex items-center justify-center mr-3">
                                 {customer.name.charAt(0)}
                              </div>
                              <span className="font-medium">{customer.name}</span>
                           </div>
                        </td>
                        <td className="px-4 py-3 text-secondary">{customer.email}</td>
                        <td className="px-4 py-3 font-medium">{customer.spent}</td>
                        <td className="px-4 py-3">{customer.orders}</td>
                        <td className="px-4 py-3 text-secondary">{customer.joined}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}
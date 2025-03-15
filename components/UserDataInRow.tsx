import React from 'react'

const UserDataInRow = ({ items }: {
   items: {
      _id: string
      name: string
      email: string
      spent: string
      totalOrders: string
      createdAt: string
   }
}) => {
   return (
      <>
         <tr key={items._id} className="border-t border-theme">
            <td className="px-4 py-3">
               <div className="flex items-center">
                  <span className="font-medium">{items.name}</span>
               </div>
            </td>
            <td className="px-4 py-3 text-secondary">
               {items.email}
            </td>
            <td className="px-4 py-3">
               <span className="inline-block px-2 py-1 rounded text-sm">
                  {items.spent}
               </span>
            </td>
            <td className="px-4 py-3">
               <span className="inline-block px-2 py-1 rounded text-sm">
                  {items.totalOrders}
               </span>
            </td>
            <td className="px-4 py-3 font-medium">{items.createdAt}</td>
         </tr>
      </>
   )
}

export default UserDataInRow;
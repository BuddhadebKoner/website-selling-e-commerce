import Link from 'next/link'
import React from 'react'

const ProductDataInRow = ({ product }: {
   product: {
      _id: string
      title: string
      productType: string
      status: string
      price: number
   }
}) => {
   return (
      <>
         <tr key={product._id} className="border-t border-theme">
            <td className="px-4 py-3">
               <div className="flex items-center">
                  <span className="font-medium">{product.title}</span>
               </div>
            </td>
            <td className="px-4 py-3 text-secondary">
               {product.productType}
            </td>
            <td className="px-4 py-3">
               <span className="inline-block px-2 py-1 rounded text-sm">
                  {product.status}
               </span>
            </td>
            <td className="px-4 py-3 font-medium">${product.price}</td>
            <td className="px-4 py-3">
               <div className="flex space-x-2">
                  <Link
                     href={`/admin-dashbord/update-product/${product._id}`}
                     className="btn btn-secondary text-sm py-1 px-3"
                  >
                     Edit
                  </Link>
                  <button className="btn btn-secondary text-sm py-1 px-3 text-accent-red">
                     Delete
                  </button>
               </div>
            </td>
         </tr>
      </>
   )
}

export default ProductDataInRow
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const ProductDataInRow = ({ product }: {
   product: {
      _id: string
      title: string
      productType: string
      status: string
      price: number
   }
}) => {
   // Local state to track changes
   const [currentStatus, setCurrentStatus] = useState<string>(product.status);
   const [currentProductType, setCurrentProductType] = useState<string>(product.productType);

   // Update local state if product prop changes
   useEffect(() => {
      setCurrentStatus(product.status);
      setCurrentProductType(product.productType);
   }, [product.status, product.productType]);

   // Handle status change
   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value;
      if (newStatus !== currentStatus) {
         setCurrentStatus(newStatus);
         console.log(`Status changed for product ${product._id}: from ${currentStatus} to ${newStatus}`);
         // Future API call would go here
      }
   };

   // Handle product type change
   const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newProductType = e.target.value;
      if (newProductType !== currentProductType) {
         setCurrentProductType(newProductType);
         console.log(`Product Type changed for product ${product._id}: from ${currentProductType} to ${newProductType}`);
         // Future API call would go here
      }
   };

   return (
      <>
         <tr key={product._id} className="border-t border-theme">
            <td className="px-4 py-3">
               <div className="flex items-center">
                  <span className="font-medium">{product.title}</span>
               </div>
            </td>
            <td className="px-4 py-3">
               <select
                  value={currentProductType}
                  onChange={handleProductTypeChange}
                  className="inline-block px-2 py-1 rounded text-sm bg-transparent border border-gray-300 focus:outline-none"
               >
                  <option value="E-commerce">E-commerce</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Business">Business</option>
                  <option value="Personal Blog">Personal Blog</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Educational">Educational</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Job Portal">Job Portal</option>
                  <option value="Social Network">Social Network</option>
               </select>
            </td>
            <td className="px-4 py-3">
               <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  className="inline-block px-2 py-1 rounded text-sm bg-transparent border border-gray-300 focus:outline-none"
               >
                  <option value="live">Live</option>
                  <option value="delay">Delay</option>
                  <option value="unabaliable">Unavailable</option>
               </select>
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
import React, { useState } from 'react';
import Link from 'next/link';
import { LoaderCircle, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { addToCart } from '@/endpoints/user.api';
import { Product } from '@/types/interfaces';

interface ProductPriceDetailsProps {
   product: Product;
   formattedPrice: string;
   mainPriceBeforeDiscount: string;
   statusColorClass: string;
   isInCart: boolean;
   currentUser: any;
   refreshCurrentUser: () => void;
   isMobile: boolean;
}

const ProductPriceDetails: React.FC<ProductPriceDetailsProps> = ({
   product,
   formattedPrice,
   mainPriceBeforeDiscount,
   statusColorClass,
   currentUser,
   refreshCurrentUser,
   isMobile
}) => {
   const [addToCartLoading, setAddToCartLoading] = useState(false);

   const handleAddToCart = async () => {
      setAddToCartLoading(true);

      // Check if user is logged in
      if (!currentUser?.id) {
         toast.error("Please log in to add items to cart");
         setAddToCartLoading(false);
         return;
      }

      try {
         // Pass cartId if it exists
         const cartId = currentUser?.cart?.id;
         if (!product) {
            toast.error("Product not found");
            setAddToCartLoading(false);
            return;
         }
         const res = await addToCart(product._id, cartId);

         if (res.success) {
            refreshCurrentUser();
            toast.success(res.message || "Added to cart successfully");
         } else {
            // Handle specific error cases
            if (res.error?.includes("Cart limit reached")) {
               toast.error("Your cart is full (max 5 products)");
            } else if (res.error?.includes("already in your cart")) {
               toast.error("This product is already in your cart");
            } else {
               toast.error(res.error || "Failed to add to cart");
            }
         }
      } catch (error) {
         console.error("Error handling add to cart:", error);
         toast.error("Something went wrong. Please try again.");
      } finally {
         setAddToCartLoading(false);
      }
   };

   if (isMobile) {
      return (
         <div className="p-3 sm:p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
               <div>
                  <div className="text-xl sm:text-2xl font-bold">{formattedPrice}</div>
                  <div className="text-xs sm:text-sm text-secondary">Includes 6 months support</div>
               </div>
               {product.status !== 'unavailable' && product.status !== 'unabaliable' && (
                  <div>
                     {product.status === 'delay' && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                           Delayed
                        </span>
                     )}
                  </div>
               )}
            </div>

            {/* Conditional rendering for product status and cart actions */}
            <div className="flex gap-2">
               {(product.status === 'unavailable' || product.status === 'unabaliable') ? (
                  <div className="flex items-center gap-2">
                     <button className="btn cursor-not-allowed btn-secondary" disabled>
                        Unavailable
                     </button>
                     <span className="text-accent-red text-sm">
                        Wait some time, this is temporarily unavailable
                     </span>
                  </div>
               ) : product.status === 'delay' ? (
                  <div className="flex items-center gap-2">
                     <button className="btn btn-secondary" disabled>
                        Delayed
                     </button>
                     <span className="text-accent-yellow text-sm">
                        Expect some delay in delivery
                     </span>
                  </div>
               ) : currentUser?.cart?.products?.some((cartProduct: Product) => cartProduct._id === product._id) ? (
                  <Link className="btn btn-primary" href="/cart">
                     Go to Cart
                  </Link>
               ) : (
                  <button
                     className="btn btn-primary"
                     onClick={handleAddToCart}
                     disabled={addToCartLoading}
                  >
                     {addToCartLoading ? (
                        <span className="flex items-center gap-1">
                           <LoaderCircle className="animate-spin" size={16} />
                           Adding...
                        </span>
                     ) : (
                        <span className="flex items-center gap-1">
                           <ShoppingBag className="w-5 h-5" />
                           Add to Cart
                        </span>
                     )}
                  </button>
               )}
            </div>
         </div>
      );
   }

   // Desktop version
   return (
      <div>
         <div className='w-fit flex justify-center items-center gap-3'>
            <div className="text-xl sm:text-2xl">{formattedPrice}</div>
            {/* override price */}
            <div className="text-xl sm:text-2xl text-secondary line-through">{mainPriceBeforeDiscount}</div>
         </div>

         {/* status */}
         <div className={`items-center text-xs px-2 py-0.5 rounded-full font-medium ${statusColorClass}`}>
            {product.status}
         </div>

         {(product.status === 'unavailable' || product.status === 'unabaliable') ? (
            <div className="flex items-center gap-2">
               <button className="btn cursor-not-allowed btn-secondary" disabled>
                  Unavailable
               </button>
               <span className="text-accent-red text-sm">
                  Wait some time, this is temporarily unavailable
               </span>
            </div>
         ) : product.status === 'delay' ? (
            <div className="flex items-center gap-2">
               <button className="btn btn-secondary" disabled>
                  Delayed
               </button>
               <span className="text-accent-yellow text-sm">
                  Expect some delay in delivery
               </span>
            </div>
         ) : currentUser?.cart?.products?.some((cartProduct: Product) => cartProduct._id === product._id) ? (
            <Link className="btn btn-primary" href="/cart">
               Go to Cart
            </Link>
         ) : (
            <button
               className="btn btn-primary"
               onClick={handleAddToCart}
               disabled={addToCartLoading}
            >
               {addToCartLoading ? (
                  <span className="flex items-center gap-1">
                     <LoaderCircle className="animate-spin" size={16} />
                     Adding...
                  </span>
               ) : (
                  <span className="flex items-center gap-1">
                     <ShoppingBag className="w-5 h-5" />
                     Add to Cart
                  </span>
               )}
            </button>
         )}
      </div>
   );
};

export default ProductPriceDetails;
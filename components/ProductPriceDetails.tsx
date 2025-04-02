import React, { useState } from 'react';
import Link from 'next/link';
import { LoaderCircle, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { addToCart } from '@/endpoints/user.api';
import { ProductCardProps } from '@/types/interfaces';

interface ProductPriceDetailsProps {
   product: ProductCardProps;
   originalPrice: number;
   discountedPrice: number;
   formattedOriginalPrice: string;
   formattedDiscountedPrice: string;
   isOfferActive: boolean;
   statusColorClass: string;
   isInCart: boolean;
   currentUser: {
      id: string;
      cart?: {
         id: string;
         products: {
            _id: string;
            title: string;
            price: number;
            bannerImageUrl: string;
            OfferStatus: string;
            OfferType: string;
            discount: number;
            offerStartDate: string;
            offerEndDate: string;
         }[];
      };
   };
   isAuthLoading: boolean;
   refreshCurrentUser: () => void;
   isMobile: boolean;
}

const ProductPriceDetails: React.FC<ProductPriceDetailsProps> = ({
   product,
   originalPrice,
   discountedPrice,
   formattedOriginalPrice,
   formattedDiscountedPrice,
   isOfferActive,
   statusColorClass,
   isInCart,
   currentUser,
   isAuthLoading,
   refreshCurrentUser,
   isMobile
}) => {
   const [addToCartLoading, setAddToCartLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const handleAddToCart = async () => {
      setError(null);
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
            setError("Product not found");
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
            const errorMessage = res.error || "Failed to add to cart";
            setError(errorMessage);

            if (errorMessage.includes("Cart limit reached")) {
               toast.error("Your cart is full (max 5 products)");
            } else if (errorMessage.includes("already in your cart")) {
               toast.error("This product is already in your cart");
            } else {
               toast.error(errorMessage);
            }
         }
      } catch (error) {
         console.error("Error handling add to cart:", error);
         setError("Something went wrong. Please try again.");
         toast.error("Something went wrong. Please try again.");
      } finally {
         setAddToCartLoading(false);
      }
   };

   // Calculate savings
   const calculateSavings = () => {
      if (!isOfferActive) return null;

      const savings = originalPrice - discountedPrice;
      const savingsPercent = Math.round((savings / originalPrice) * 100);

      return {
         amount: savings,
         percent: savingsPercent
      };
   };

   const savings = calculateSavings();
   const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
   });

   // Product has a status of 'live', 'unavailable', or 'delay'
   const isProductAvailable = product.status === 'live';
   const isProductDelayed = product.status === 'delay';
   const isProductUnavailable = product.status === 'unavailable' || product.status === 'unabaliable';

   if (isMobile) {
      return (
         <div className="p-3 sm:p-4 rounded-lg bg-background-secondary">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
               <div>
                  {isOfferActive ? (
                     <div>
                        <div className="flex items-center gap-2">
                           <div className="text-xl sm:text-2xl font-bold">{formattedDiscountedPrice}</div>
                           <div className="text-sm text-secondary line-through">{formattedOriginalPrice}</div>
                        </div>
                        <div className="text-xs text-accent-green">
                           Save {savings ? formatter.format(savings.amount) : ''} ({savings?.percent}%)
                        </div>
                     </div>
                  ) : (
                     <div className="text-xl sm:text-2xl font-bold">{formattedOriginalPrice}</div>
                  )}
                  <div className="text-xs sm:text-sm text-secondary mt-1">Includes 6 months support</div>
               </div>

               {!isProductUnavailable && (
                  <div>
                     <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusColorClass}`}>
                        {product.status === 'live' ? 'Available' : product.status}
                     </span>
                  </div>
               )}
            </div>

            {/* Error message if any */}
            {error && (
               <div className="text-accent-red text-sm mb-3 bg-accent-red/10 p-2 rounded">
                  {error}
               </div>
            )}

            {/* Conditional rendering for product status and cart actions */}
            <div className="flex gap-2">
               {isProductUnavailable ? (
                  <div className="w-full">
                     <button className="btn cursor-not-allowed btn-secondary w-full" disabled>
                        Unavailable
                     </button>
                     <span className="text-accent-red text-xs block mt-1">
                        This product is temporarily unavailable
                     </span>
                  </div>
               ) : isProductDelayed ? (
                  <div className="w-full">
                     <button className="btn btn-secondary w-full" disabled>
                        Delayed Delivery
                     </button>
                     <span className="text-accent-yellow text-xs block mt-1">
                        Expect some delay in delivery
                     </span>
                  </div>
               ) : isInCart ? (
                  <Link className="btn btn-primary w-full" href="/cart">
                     Go to Cart
                  </Link>
               ) : (
                  <button
                     className="btn btn-primary w-full"
                     onClick={handleAddToCart}
                     disabled={addToCartLoading || isAuthLoading || !isProductAvailable}
                  >
                     {addToCartLoading ? (
                        <span className="flex items-center justify-center gap-1">
                           <LoaderCircle className="animate-spin" size={16} />
                           Adding...
                        </span>
                     ) : isAuthLoading ? (
                        <span className="flex items-center justify-center gap-1">
                           <LoaderCircle className="animate-spin" size={16} />
                           Loading...
                        </span>
                     ) : (
                        <span className="flex items-center justify-center gap-1">
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
      <div className="w-full bg-background-secondary p-6 rounded-lg border border-theme">
         <div className="mb-4">
            {isOfferActive ? (
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <div className="text-2xl font-bold">{formattedDiscountedPrice}</div>
                     <div className="text-lg text-secondary line-through">{formattedOriginalPrice}</div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-sm bg-accent-green text-white px-2 py-0.5 rounded">
                        {savings?.percent}% OFF
                     </span>
                     <span className="text-sm text-accent-green">
                        Save {formatter.format(savings?.amount || 0)}
                     </span>
                  </div>
               </div>
            ) : (
               <div className="text-2xl font-bold mb-2">{formattedOriginalPrice}</div>
            )}
            <div className="text-sm text-secondary mt-2">One-time payment • Includes 6 months support</div>
         </div>

         {/* Product status badge */}
         <div className="mb-4">
            <span className={`inline-flex items-center text-sm px-2 py-1 rounded-md font-medium ${statusColorClass}`}>
               {product.status === 'live' ? 'Available' : product.status}
            </span>
         </div>

         {/* Error message if any */}
         {error && (
            <div className="text-accent-red text-sm mb-4 bg-accent-red/10 p-3 rounded">
               {error}
            </div>
         )}

         {/* Action buttons */}
         <div className="space-y-3">
            {isProductUnavailable ? (
               <div>
                  <button className="btn cursor-not-allowed btn-secondary w-full" disabled>
                     Unavailable
                  </button>
                  <span className="text-accent-red text-sm block mt-1">
                     This product is temporarily unavailable
                  </span>
               </div>
            ) : isProductDelayed ? (
               <div>
                  <button className="btn btn-secondary w-full" disabled>
                     Delayed Delivery
                  </button>
                  <span className="text-accent-yellow text-sm block mt-1">
                     Expect some delay in delivery
                  </span>
               </div>
            ) : isInCart ? (
               <Link className="btn btn-primary w-full flex items-center justify-center" href="/cart">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Go to Cart
               </Link>
            ) : (
               <button
                  className="btn btn-primary w-full"
                  onClick={handleAddToCart}
                  disabled={addToCartLoading || isAuthLoading || !isProductAvailable}
               >
                  {addToCartLoading ? (
                     <span className="flex items-center justify-center gap-1">
                        <LoaderCircle className="animate-spin" size={16} />
                        Adding to Cart...
                     </span>
                  ) : isAuthLoading ? (
                     <span className="flex items-center justify-center gap-1">
                        <LoaderCircle className="animate-spin" size={16} />
                        Loading...
                     </span>
                  ) : (
                     <span className="flex items-center justify-center gap-1">
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                     </span>
                  )}
               </button>
            )}

            {product.liveLink && (
               <a
                  href={product.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full flex items-center justify-center"
               >
                  View Live Demo
               </a>
            )}
         </div>

         {/* Order info */}
         <div className="mt-4 text-xs text-secondary">
            <p className="mb-1">• Secure payment processing</p>
            <p className="mb-1">• Full source code access</p>
            <p>• Support via email for 6 months</p>
         </div>
      </div>
   );
};

export default ProductPriceDetails;
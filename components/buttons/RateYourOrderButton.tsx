"use client";
import { useState } from 'react';
import { Star, X, Loader2, ChevronRight } from 'lucide-react';
import { createRating } from '@/endpoints/rating.api';
import { toast } from 'react-toastify';

interface ProductData {
   productId: string;
   title: string;
   price: number;
   productType: string;
}

const RateYourOrderButton = ({
   productsData,
   orderId,
}: {
   productsData: ProductData[];
   orderId: string;
}) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [currentProductIndex, setCurrentProductIndex] = useState(0);
   const [ratings, setRatings] = useState<{ [key: string]: { rating: number; comment: string } }>({});
   const [isHovering, setIsHovering] = useState(0);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const openModal = () => {
      setIsModalOpen(true);
      setCurrentProductIndex(0);
      // Initialize ratings object with empty values for all products
      const initialRatings: { [key: string]: { rating: number; comment: string } } = {};
      productsData.forEach(product => {
         initialRatings[product.productId] = { rating: 0, comment: '' };
      });
      setRatings(initialRatings);
      setError(null);
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setIsHovering(0);
      setRatings({});
      setError(null);
   };

   const currentProduct = productsData[currentProductIndex];

   const getCurrentRating = () => {
      return currentProduct ? (ratings[currentProduct.productId]?.rating || 0) : 0;
   };

   const getCurrentComment = () => {
      return currentProduct ? (ratings[currentProduct.productId]?.comment || '') : '';
   };

   const setCurrentRating = (value: number) => {
      if (!currentProduct) return;

      setRatings(prev => ({
         ...prev,
         [currentProduct.productId]: {
            ...prev[currentProduct.productId],
            rating: value
         }
      }));
   };

   const setCurrentComment = (value: string) => {
      if (!currentProduct) return;

      setRatings(prev => ({
         ...prev,
         [currentProduct.productId]: {
            ...prev[currentProduct.productId],
            comment: value
         }
      }));
   };

   const handleSubmitCurrentProduct = async () => {
      if (!currentProduct) return;

      // Validate current product rating
      if (getCurrentRating() === 0) {
         setError("Please select a rating");
         return;
      }

      setError(null);
      setIsSubmitting(true);

      const ratingData = {
         rating: getCurrentRating(),
         comment: getCurrentComment(),
         productId: currentProduct.productId,
         orderId,
      };

      console.log("Submitting rating data:", ratingData);

      try {
         const response = await createRating({ rating: ratingData });

         if (response.success) {
            // If this is the last product, close modal and show success
            if (currentProductIndex === productsData.length - 1) {
               toast.success("Thanks for rating all your products!");
               closeModal();
            } else {
               // Move to next product
               setCurrentProductIndex(prev => prev + 1);
               toast.success(`Rating for ${currentProduct.title} submitted successfully!`);
            }
         } else {
            setError(response.error || "Failed to submit your review. Please try again.");
         }
      } catch (err) {
         setError("An unexpected error occurred. Please try again later.");
         console.error("Rating submission error:", err);
      } finally {
         setIsSubmitting(false);
      }
   };

   if (!productsData || productsData.length === 0) {
      return null;
   }

   return (
      <>
         <button
            className="btn btn-primary text-xs py-1.5 px-3 rounded transition-all"
            onClick={openModal}
         >
            Rate Your Order
         </button>

         {isModalOpen && currentProduct && (
            <div className="fixed inset-0 w-full h-screen bg-glass/95 backdrop-blur-sm flex items-start justify-center pt-16 px-4 z-50 animate-fadeIn overflow-y-auto">
               <div className="w-full max-w-3xl bg-background-secondary border border-theme rounded-lg shadow-xl animate-slideDown p-5 mt-16">
                  <div className="flex justify-between items-center p-4 border-b border-theme">
                     <div>
                        <h3 className="text-primary text-lg font-medium">Rate Your Order</h3>
                        <p className="text-secondary text-xs mt-1">
                           Product {currentProductIndex + 1} of {productsData.length}
                        </p>
                     </div>
                     <button
                        onClick={closeModal}
                        className="text-secondary hover:text-primary transition-all"
                        aria-label="Close"
                        disabled={isSubmitting}
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div className="p-5">
                     <div className="mb-4 p-3 border border-theme rounded-md">
                        <h4 className="font-medium text-primary">{currentProduct.title}</h4>
                        <p className="text-secondary text-sm mt-1">
                           {currentProduct.productType} · ${currentProduct.price}
                        </p>
                     </div>

                     {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
                           {error}
                        </div>
                     )}

                     <div className="form-group mb-5">
                        <label className="form-label text-primary text-sm font-medium mb-2">Your Rating</label>
                        <div className="flex items-center space-x-2">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                 key={star}
                                 type="button"
                                 className="transition-all focus-visible:outline-none"
                                 onMouseEnter={() => setIsHovering(star)}
                                 onMouseLeave={() => setIsHovering(0)}
                                 onClick={() => setCurrentRating(star)}
                                 disabled={isSubmitting}
                              >
                                 <Star
                                    size={28}
                                    fill={(isHovering || getCurrentRating()) >= star ? "currentColor" : "none"}
                                    className={`cursor-pointer transition-colors ${isSubmitting ? "opacity-50" : ""
                                       } ${(isHovering || getCurrentRating()) >= star
                                          ? "accent-yellow"
                                          : "text-secondary"
                                       }`}
                                 />
                              </button>
                           ))}
                           <span className="text-xs ml-2 text-secondary">
                              {getCurrentRating() > 0 &&
                                 `${getCurrentRating()} ${getCurrentRating() === 1 ? 'Star' : 'Stars'}`
                              }
                           </span>
                        </div>
                     </div>

                     <div className="form-group mb-5">
                        <label htmlFor="comment" className="form-label text-primary text-sm font-medium mb-2">
                           Your Feedback
                        </label>
                        <textarea
                           id="comment"
                           value={getCurrentComment()}
                           onChange={(e) => setCurrentComment(e.target.value)}
                           className="form-input min-h-24 w-full"
                           placeholder="Share your experience with this product..."
                           disabled={isSubmitting}
                           maxLength={500}
                        />
                        <div className="text-xs text-secondary mt-1">
                           {getCurrentComment().length}/500 characters
                        </div>
                     </div>

                     <div className="flex justify-end space-x-3">
                        <button
                           type="button"
                           onClick={closeModal}
                           className="btn btn-secondary text-sm"
                           disabled={isSubmitting}
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleSubmitCurrentProduct}
                           disabled={getCurrentRating() === 0 || isSubmitting}
                           className={`btn text-xs py-1.5 px-3 rounded transition-all flex items-center ${getCurrentRating() === 0 || isSubmitting
                              ? 'bg-secondary cursor-not-allowed opacity-70'
                              : 'btn-primary'
                              }`}
                        >
                           {isSubmitting ? (
                              <>
                                 <Loader2 size={16} className="animate-spin mr-2" />
                                 Submitting...
                              </>
                           ) : (
                              <>
                                 {currentProductIndex === productsData.length - 1 ? "Submit Review" : "Next Product"}
                                 {currentProductIndex < productsData.length - 1 && (
                                    <ChevronRight size={16} className="ml-1" />
                                 )}
                              </>
                           )}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default RateYourOrderButton;
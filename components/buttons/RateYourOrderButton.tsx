"use client";
import { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { createRating } from '@/endpoints/rating.api';
import { toast } from 'react-toastify';

const RateYourOrderButton = ({
   productIds,
   orderId,
}: {
   productIds: string[];
   orderId: string;
}) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState('');
   const [isHovering, setIsHovering] = useState(0);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const openModal = () => {
      setIsModalOpen(true);
      // Reset states when opening modal
      setError(null);
      setRating(0);
      setComment('');
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setIsHovering(0);
      setRating(0);
      setComment('');
      setError(null);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validate before submission
      if (rating === 0) {
         setError("Please select a rating");
         return;
      }

      const ratingData = {
         rating,
         comment,
         productIds,
         orderId,
      };

      setIsSubmitting(true);

      try {
         const response = await createRating({ rating: ratingData });

         if (response.success) {
            toast.success("Thank you for your feedback!");
            closeModal();
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

   return (
      <>
         <button
            className="btn btn-primary text-xs py-1.5 px-3 rounded transition-all"
            onClick={openModal}
         >
            Rate Your Order
         </button>

         {isModalOpen && (
            <div className="fixed inset-0 w-full h-screen bg-glass/95 backdrop-blur-sm flex items-start justify-center pt-16 px-4 z-50 animate-fadeIn overflow-y-auto">
               <div className="w-full max-w-3xl bg-background-secondary border border-theme rounded-lg shadow-xl animate-slideDown p-5 mt-16">
                  <div className="flex justify-between items-center p-4 border-b border-theme">
                     <h3 className="text-primary text-lg font-medium">Rate Your Order</h3>
                     <button
                        onClick={closeModal}
                        className="text-secondary hover:text-primary transition-all"
                        aria-label="Close"
                        disabled={isSubmitting}
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="p-5">
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
                                 onClick={() => setRating(star)}
                                 disabled={isSubmitting}
                              >
                                 <Star
                                    size={28}
                                    fill={(isHovering || rating) >= star ? "currentColor" : "none"}
                                    className={`cursor-pointer transition-colors ${isSubmitting ? "opacity-50" : ""
                                       } ${(isHovering || rating) >= star
                                          ? "accent-yellow"
                                          : "text-secondary"
                                       }`}
                                 />
                              </button>
                           ))}
                           <span className="text-xs ml-2 text-secondary">
                              {rating > 0 &&
                                 `${rating} ${rating === 1 ? 'Star' : 'Stars'}`
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
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                           className="form-input min-h-24 w-full"
                           placeholder="Share your experience with this order..."
                           disabled={isSubmitting}
                           maxLength={500}
                        />
                        <div className="text-xs text-secondary mt-1">
                           {comment.length}/500 characters
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
                           type="submit"
                           disabled={rating === 0 || isSubmitting}
                           className={`btn text-xs py-1.5 px-3 rounded transition-all ${rating === 0 || isSubmitting
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
                              "Submit Review"
                           )}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </>
   );
};

export default RateYourOrderButton;
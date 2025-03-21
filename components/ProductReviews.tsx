import React from 'react';
import { Star } from 'lucide-react';

interface Review {
   id: number;
   name: string;
   rating: number;
   date: string;
   comment: string;
}

interface ProductReviewsProps {
   reviews: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
   // Rating stars component
   const RatingStars = ({ rating }: { rating: number }) => {
      return (
         <div className="flex">
            {[...Array(5)].map((_, i) => (
               <Star
                  key={i}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
               />
            ))}
         </div>
      );
   };

   return (
      <div className="card p-4 sm:p-6">
         <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Customer Reviews</h2>
            <span className="bg-background-secondary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
               {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
         </div>

         <div className="space-y-4 sm:space-y-6">
            {reviews.map(review => (
               <div key={review.id} className="border-b border-theme pb-4 sm:pb-6 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 mb-2">
                     <div>
                        <h4 className="font-semibold text-sm sm:text-base">{review.name}</h4>
                        <p className="text-xs sm:text-sm text-secondary">{review.date}</p>
                     </div>
                     <RatingStars rating={review.rating} />
                  </div>
                  <p className="text-secondary text-sm sm:text-base">{review.comment}</p>
               </div>
            ))}
         </div>

         <div className="mt-6 sm:mt-8 text-center">
            <button className="btn btn-secondary hover:bg-opacity-90 transition-all text-sm">
               Write a Review
            </button>
         </div>
      </div>
   );
};

export default ProductReviews;
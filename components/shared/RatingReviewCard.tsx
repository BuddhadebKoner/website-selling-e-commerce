import { formatDate } from '@/lib/utils/formatDate'
import { IReview } from '@/types/interfaces'
import { Star, StarHalf, User } from 'lucide-react'
import React from 'react'

const RatingReviewCard = ({ review }: {
   review: IReview
}) => {

   const getRatingColor = (rating: number) => {
      if (rating >= 4) return 'var(--accent-green)';
      if (rating >= 3) return 'var(--accent-yellow)';
      if (rating >= 2) return 'var(--accent-orange)';
      return 'var(--accent-red)';
   };


   // Render stars based on rating
   const renderStars = (rating: number) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;

      // Add full stars
      for (let i = 0; i < fullStars; i++) {
         stars.push(
            <Star
               key={`star-${i}`}
               className="h-5 w-5"
               style={{ fill: getRatingColor(rating), color: getRatingColor(rating) }}
            />
         );
      }

      if (hasHalfStar) {
         stars.push(
            <StarHalf
               key="half-star"
               className="h-5 w-5"
               style={{ fill: getRatingColor(rating), color: getRatingColor(rating) }}
            />
         );
      }

      const emptyStars = 5 - stars.length;
      for (let i = 0; i < emptyStars; i++) {
         stars.push(<Star key={`empty-star-${i}`} className="h-5 w-5 text-secondary" style={{ color: 'var(--border-color)' }} />);
      }

      return stars;
   };

   return (
      <div className="p-5">
         <div className="flex items-start gap-4">
            {/* Avatar placeholder */}
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-alpha)' }}>
               <User className="h-6 w-6" style={{ color: 'var(--highlight-primary)' }} />
            </div>

            <div className="flex-1">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                     {Array.isArray(review.userName) ? review.userName[0] : review.userName}
                  </h3>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                     {formatDate(review.createdAt)}
                  </span>
               </div>

               <div className="flex mt-2 mb-3">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm font-medium" style={{ color: getRatingColor(review.rating) }}>
                     {review.rating.toFixed(1)}
                  </span>
               </div>

               {review.comment ? (
                  <p style={{ color: 'var(--text-primary)' }} className="mt-2">
                     {review.comment}
                  </p>
               ) : (
                  <p className="italic mt-2" style={{ color: 'var(--text-secondary)' }}>
                     No written review provided
                  </p>
               )}
            </div>
         </div>
      </div>
   )
}

export default RatingReviewCard
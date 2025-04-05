// import React, { useState } from 'react';
// import { Star, StarHalf, MessageSquare, LoaderCircle } from 'lucide-react';

// interface ReviewsProps {
//    productId: string;
//    totalRating: number;
//    rating: number;
// }

// // This is a placeholder component - you would integrate with your actual reviews API
// const ProductReviews: React.FC<ReviewsProps> = ({ totalRating, rating }) => {
//    const [isLoading, setIsLoading] = useState(false);

//    // Sample reviews data for demonstration
//    const reviews = [
//       {
//          id: 1,
//          name: "Alex Johnson",
//          rating: 5,
//          date: "March 15, 2025",
//          comment: "This template is exactly what I needed for my portfolio. Easy to customize and looks very professional."
//       },
//       {
//          id: 2,
//          name: "Sarah Williams",
//          rating: 4,
//          date: "March 10, 2025",
//          comment: "Great design and well-structured code. I had a small issue with mobile responsiveness but the support team helped me fix it quickly."
//       },
//       {
//          id: 3,
//          name: "Michael Chen",
//          rating: 5,
//          date: "March 5, 2025",
//          comment: "Best purchase I've made for my freelance business. The clean design really helps showcase my work effectively."
//       }
//    ];

//    // Calculate rating display
//    const displayRating = rating > 0 ? rating : totalRating > 0 ? totalRating : 0;
//    const fullStars = Math.floor(displayRating);
//    const hasHalfStar = displayRating % 1 >= 0.5;
//    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//    return (
//       <div>
//          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-6">Customer Reviews</h2>

//          {/* Rating summary */}
//          <div className="flex items-center mb-6">
//             <div className="flex items-center text-yellow-500 mr-3">
//                {Array(fullStars).fill(0).map((_, i) => (
//                   <Star key={`full-${i}`} fill="currentColor" className="w-5 h-5" />
//                ))}
//                {hasHalfStar && <StarHalf fill="currentColor" className="w-5 h-5" />}
//                {Array(emptyStars).fill(0).map((_, i) => (
//                   <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
//                ))}
//             </div>
//             <span className="font-medium text-lg">{displayRating.toFixed(1)}</span>
//             <span className="text-secondary ml-2">based on {reviews.length} reviews</span>
//          </div>

//          {/* Reviews list */}
//          {isLoading ? (
//             <div className="flex justify-center py-10">
//                <LoaderCircle className="animate-spin w-8 h-8 text-primary" />
//             </div>
//          ) : reviews.length > 0 ? (
//             <div className="space-y-6">
//                {reviews.map(review => (
//                   <div key={review.id} className="border-b border-theme pb-6">
//                      <div className="flex justify-between items-start mb-2">
//                         <div>
//                            <div className="font-medium">{review.name}</div>
//                            <div className="text-secondary text-sm">{review.date}</div>
//                         </div>
//                         <div className="flex text-yellow-500">
//                            {Array(5).fill(0).map((_, i) => (
//                               <Star
//                                  key={i}
//                                  className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
//                               />
//                            ))}
//                         </div>
//                      </div>
//                      <p className="text-secondary">{review.comment}</p>
//                   </div>
//                ))}
//             </div>
//          ) : (
//             <div className="text-center py-8 border border-dashed border-theme rounded-lg">
//                <MessageSquare className="w-10 h-10 text-secondary mx-auto mb-3" />
//                <p className="text-secondary">No reviews yet for this product</p>
//                <p className="text-sm text-secondary mt-1">Be the first to leave a review!</p>
//             </div>
//          )}

//          {/* Write a review button */}
//          <div className="mt-8 text-center">
//             <button
//                className="btn btn-secondary"
//                onClick={() => alert("Review feature will be implemented soon!")}
//             >
//                Write a Review
//             </button>
//          </div>
//       </div>
//    );
// };

// export default ProductReviews;

import React from 'react'

const ProductReviews = ({ productId, totalRating, rating }: {
  productId: string;
  totalRating: number;
  rating: number;
}) => {

  console.log('ProductReviews', productId, totalRating, rating);

  return (
    <div>ProductReviews</div>
  )
}

export default ProductReviews
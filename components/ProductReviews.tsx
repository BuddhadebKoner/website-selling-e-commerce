import { useGetAllRatings } from '@/lib/react-query/queriesAndMutation';
import React, { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import RatingReviewCard from './shared/RatingReviewCard';

const ProductReviews = ({ slug }: { slug: string }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useGetAllRatings(slug);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Product Reviews</h2>

      {/* Reviews count summary */}
      {data && !isLoading && data.pages[0].pagination.totalRatings > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-5 w-5"
                style={{
                  fill: star <= (Math.round(4.5 * 2) / 2) ? 'var(--highlight-primary)' : 'transparent',
                  color: star <= (Math.round(4.5 * 2) / 2) ? 'var(--highlight-primary)' : 'var(--border-color)'
                }}
              />
            ))}
          </div>
          <span className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
            {data.pages[0].pagination.totalRatings} {data.pages[0].pagination.totalRatings === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: 'var(--highlight-primary)' }}></div>
        </div>
      ) : isError ? (
        <div className="py-4 rounded-lg p-4" style={{ color: 'var(--accent-red)', backgroundColor: 'var(--accent-alpha)' }}>
          Error loading reviews: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : (
        <>
          {data?.pages.flatMap((page) => page.ratings).length === 0 ? (
            <div className="text-center py-8 card animate-fadeIn" style={{ color: 'var(--text-secondary)' }}>
              No reviews yet for this product
            </div>
          ) : (
            <div className="space-y-6">
              {data?.pages.map((page) =>
                page.ratings.map((review: {
                  _id: string;
                  userName: string;
                  rating: number;
                  review: string;
                  createdAt: string;
                }) => (
                  <RatingReviewCard
                    review={review}
                    key={review._id}
                  />
                ))
              )}
            </div>
          )}

          {/* Loading more indicator */}
          <div ref={loadMoreRef} className="py-4">
            {isFetchingNextPage ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2" style={{ borderColor: 'var(--highlight-primary)' }}></div>
              </div>
            ) : hasNextPage ? (
              <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                Scroll for more reviews
              </div>
            ) : data?.pages[0].pagination.totalRatings > 0 ? (
              <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                You&apos;ve reached the end of reviews
              </div>
            ) : null}
          </div>
        </>
      )}

      {/* Display pagination info */}
      {data && !isLoading && data.pages[0].pagination.totalRatings > 0 && (
        <div className="text-sm text-center rounded-md py-2 px-4" style={{
          backgroundColor: 'var(--background-secondary)',
          color: 'var(--text-secondary)'
        }}>
          Showing {data.pages.flatMap(page => page.ratings).length} of{' '}
          {data.pages[0].pagination.totalRatings} reviews
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
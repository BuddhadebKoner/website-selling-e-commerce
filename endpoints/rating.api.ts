import { Rating } from "@/types/interfaces";

export async function createRating({ rating }: { rating: Rating }) {
   try {
      const response = await fetch('/api/public/rating', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(rating),
      });

      const data = await response.json();

      if (!response.ok) {
         throw new Error(data.error || 'Failed to create rating');
      }

      return {
         success: true,
         data: data,
      };
   } catch (error) {
      console.error('Error in creating rating:', error);
      return {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error occurred while creating rating',
      };
   }
}
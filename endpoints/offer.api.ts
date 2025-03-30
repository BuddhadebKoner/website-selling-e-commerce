export async function getAllOffers() {
   try {
      const response = await fetch('/api/public/offers');

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || `Error ${response.status}: Failed to fetch offers`);
      }

      const data = await response.json();

      if (!data.success) {
         throw new Error(data.error || 'Failed to fetch offers');
      }

      return data.offers;
   } catch (error) {
      console.error('Error in fetching offers:', error);
      throw error; // Rethrow to be handled by React Query
   }
}
export async function getAllOffers({ page = 1, limit = 10 } = {}) {
   try {
      // Add pagination parameters to the URL
      const url = `/api/public/offers?page=${page}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || `Error ${response.status}: Failed to fetch offers`);
      }

      const data = await response.json();
      if (!data.success) {
         throw new Error(data.error || 'Failed to fetch offers');
      }

      return {
         offers: data.offers,
         currentPage: data.page,
         limit: data.limit,
         totalOffers: data.totalOffers,
         totalPages: data.totalPages
      };
   } catch (error) {
      console.error('Error in fetching offers:', error);
      return {
         error: true,
         message: error instanceof Error ? error.message : 'Failed to fetch offers',
         offers: [],
         currentPage: page,
         limit,
         totalOffers: 0,
         totalPages: 0
      };
   }
}
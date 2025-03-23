export const getAllOffer = async (page = 1, limit = 5) => {
   try {
      const response = await fetch(`/api/public/offer?page=${page}&limit=${limit}`);
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }
      return {
         data: result.data,
         currentPage: result.pagination?.currentPage,
         totalPages: result.pagination?.totalPages
      };
   } catch (error) {
      console.error("Failed to get offers", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
}

export const getOfferBySlug = async (slug: string) => { 
   try {
      const response = await fetch(`/api/public/offer/${slug}`);
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }
      return result;
   } catch (error) {
      console.error("Failed to get offer", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};
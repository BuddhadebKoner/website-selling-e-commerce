export const getAllProducts = async (page = 1, limit = 10) => {
   try {
      const response = await fetch(`/api/public/products?page=${page}&limit=${limit}`);
      const result = await response.json();

      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }

      return {
         data: result.data,
         currentPage: result.pagination.currentPage,
         totalPages: result.pagination.totalPages
      };
   } catch (error) {
      console.error("Failed to get products", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const getLiveProducts = async (page = 1, limit = 10) => {
   try {
      const response = await fetch(`/api/public/products/live?page=${page}&limit=${limit}`);
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }
      return {
         data: result.data,
         currentPage: result.pagination.currentPage,
         totalPages: result.pagination.totalPages
      };
   } catch (error) {
      console.error("Failed to get live products", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const getDelayedProducts = async (page = 1, limit = 10) => {
   try {
      const response = await fetch(`/api/public/products/delay?page=${page}&limit=${limit}`);
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }
      return {
         data: result.data,
         currentPage: result.pagination.currentPage,
         totalPages: result.pagination.totalPages
      };
   } catch (error) {
      console.error("Failed to get delayed products", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const getUnavailableProducts = async (page = 1, limit = 10) => {
   try {
      const response = await fetch(`/api/public/products/unabaliable?page=${page}&limit=${limit}`);
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }
      return {
         data: result.data,
         currentPage: result.pagination.currentPage,
         totalPages: result.pagination.totalPages
      };
   } catch (error) {
      console.error("Failed to get unavailable products", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};
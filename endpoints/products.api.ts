export const getAllProducts = async (page = 1, limit = 5) => {
   try {
      const response = await fetch(`/api/public/products?page=${page}&limit=${limit}`);
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
      console.error("Failed to get products", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const getProductsByStatus = async (status: string, page = 1, limit = 5) => {
   try {
      const response = await fetch(`/api/public/products/status?status=${status}&page=${page}&limit=${limit}`);
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
      console.error(`Failed to get products with status: ${status}`, error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const getProductsByType = async (productType: string, page = 1, limit = 5) => {
   try {
      // Encode the productType to handle spaces in values like "Personal Blog"
      const encodedType = encodeURIComponent(productType);
      const response = await fetch(`/api/public/products/producttype?type=${encodedType}&page=${page}&limit=${limit}`);
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
      console.error(`Failed to get products with type: ${productType}`, error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

// get product by id
export const getProductBySlug = async (slug: string) => {
   try {
      const response = await fetch(`/api/public/products/${slug}`);
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }
      return result;
   } catch (error) {
      console.error("Failed to get product", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};
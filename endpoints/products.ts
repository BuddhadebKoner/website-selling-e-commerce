// endpoints/products.api.ts
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

export const getProductsByStatus = async (status: string, page = 1, limit = 10) => {
   try {
      const response = await fetch(`/api/public/products/status?status=${status}&page=${page}&limit=${limit}`);
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
      console.error(`Failed to get products with status: ${status}`, error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const getProductsByType = async (productType: string, page = 1, limit = 10) => {
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
         currentPage: result.pagination.currentPage,
         totalPages: result.pagination.totalPages
      };
   } catch (error) {
      console.error(`Failed to get products with type: ${productType}`, error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

// endpoints/admin.api.ts
export const updateProductStatus = async (productId: string, status: string) => {
   try {
      const response = await fetch(`/api/admin/products/${productId}/status`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
         throw new Error(result.error || "Failed to update status");
      }

      return result;
   } catch (error) {
      console.error("Failed to update product status", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const updateProductType = async (productId: string, productType: string) => {
   try {
      const response = await fetch(`/api/admin/products/${productId}/type`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ productType }),
      });

      const result = await response.json();

      if (!response.ok) {
         throw new Error(result.error || "Failed to update product type");
      }

      return result;
   } catch (error) {
      console.error("Failed to update product type", error);
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

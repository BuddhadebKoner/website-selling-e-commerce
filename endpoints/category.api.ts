export const getAllCategory = async (page = 1, limit = 10) => {
   try {
      const response = await fetch(`/api/public/categories?page=${page}&limit=${limit}`);
      const result = await response.json();

      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }

      return result;
   } catch (error) {
      console.error("Failed to get categories", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};

export const getCategoryBySlug = async (id: string) => {
   try {
      const response = await fetch(`/api/public/categories/${id}`);
      const result = await response.json();
      if (!response.ok) {
         throw new Error(result.error || "Failed to fetch");
      }
      return result.category;
   } catch (error) {
      console.error("Failed to get product", error);
      return { error: error instanceof Error ? error.message : "Internal Server Error" };
   }
};
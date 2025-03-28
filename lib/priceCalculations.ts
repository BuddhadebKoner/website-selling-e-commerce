/**
 * Utility functions for consistent price calculations throughout the application
 */

// Format price with proper currency symbol and decimal places
export const formatPrice = (price: number) => {
   return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
   }).format(price);
};

// Calculate discounted price based on discount type and amount
export const calculateDiscountedPrice = (
   originalPrice: number,
   discountAmount: number,
   discountType: 'percentage' | 'fixed'
): number => {
   if (discountType === 'percentage') {
      return roundPrice(originalPrice - (originalPrice * (discountAmount / 100)));
   } else {
      return roundPrice(originalPrice - discountAmount);
   }
};

// Round price to 2 decimal places for internal calculations
export const roundPrice = (price: number): number => {
   return Math.round(price * 100) / 100;
};

// Calculate all cart totals in one place to ensure consistency
export const calculateCartTotals = (items: any[], taxRate: number = 0.08) => {
   // Calculate original total (before any discounts)
   const originalTotal = items.reduce((sum, item) => sum + item.price, 0);

   // Calculate subtotal after discounts (this is the price before tax)
   const subtotal = items.reduce((sum, item) =>
      sum + (item.discountedPrice !== undefined ? item.discountedPrice : item.price), 0);

   // Calculate total discount amount 
   const discountAmount = roundPrice(originalTotal - subtotal);

   // Calculate tax on subtotal (after discounts)
   const tax = roundPrice(subtotal * taxRate);

   // Calculate final total (this is the payable amount)
   const total = roundPrice(subtotal + tax);

   return {
      originalTotal: roundPrice(originalTotal),  // Sum of original prices without any discounts
      subtotal: roundPrice(subtotal),            // Sum after discounts but before tax
      tax: roundPrice(tax),                      // Tax amount calculated on subtotal
      total: roundPrice(total),                  // Final payable amount (subtotal + tax)
      discountAmount: roundPrice(discountAmount) // Total amount saved due to discounts
   };
};
"use client";

import { useState } from "react";

// Product input field with tags display
const ProductInput = ({
   value,
   onChange,
   error
}: {
   value: string[];
   onChange: (products: string[]) => void;
   error?: string;
}) => {
   const [inputValue, setInputValue] = useState<string>('');
   const [isAdding, setIsAdding] = useState<boolean>(false);
   const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

   // Handle when a product is added via input
   const handleAddProduct = () => {
      if (!inputValue.trim()) return;

      const newProducts = [...value];
      const productToAdd = inputValue.trim();

      if (!newProducts.includes(productToAdd)) {
         // Show adding animation
         setIsAdding(true);

         newProducts.push(productToAdd);
         onChange(newProducts);

         // Track recently added item for animation
         setRecentlyAdded(productToAdd);
         setTimeout(() => {
            setIsAdding(false);
            setTimeout(() => setRecentlyAdded(null), 1500);
         }, 300);
      }

      setInputValue('');
   };

   // Handle when a product is removed
   const handleRemoveProduct = (productId: string) => {
      const newProducts = value.filter(id => id !== productId);
      onChange(newProducts);
   };

   // Allow adding products with Enter key
   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         handleAddProduct();
      }
   };

   return (
      <div className="form-group">
         <label htmlFor="productIds" className="form-label text-primary">
            Product IDs <span className="text-secondary text-xs">(add one at a time)</span>
         </label>
         <div className="flex">
            <input
               id="productIds"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Enter a product ID"
               className="form-input flex-grow rounded-l-md border border-theme p-2 focus:border-highlight transition-all"
               disabled={isAdding}
            />
            <button
               type="button"
               onClick={handleAddProduct}
               disabled={isAdding || !inputValue.trim()}
               className={`${!inputValue.trim()
                     ? 'bg-background-secondary text-secondary cursor-not-allowed'
                     : 'bg-highlight text-white hover:bg-highlight-secondary'
                  } px-4 rounded-r-md transition-all`}
            >
               {isAdding ? 'Adding...' : 'Add'}
            </button>
         </div>
         {error && <p className="text-accent-red text-sm mt-1">{error}</p>}

         {value.length > 0 && (
            <div className="mt-3">
               <p className="text-sm text-secondary mb-2">
                  {value.length} product{value.length !== 1 ? 's' : ''} added
               </p>
               <div className="flex flex-wrap gap-2">
                  {value.map((id) => (
                     <span
                        key={id}
                        className={`
                           ${recentlyAdded === id ? 'animate-fadeIn bg-accent' : 'bg-background-secondary'} 
                           text-sm px-3 py-1 rounded-full flex items-center group 
                           hover:bg-accent transition-all
                           border border-theme
                        `}
                     >
                        <span className="mr-2 truncate max-w-xs">{id}</span>
                        <button
                           type="button"
                           onClick={() => handleRemoveProduct(id)}
                           aria-label={`Remove product ${id}`}
                           className="text-secondary hover:text-accent-red focus:outline-none transition-colors"
                        >
                           ×
                        </button>
                     </span>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

export default ProductInput;
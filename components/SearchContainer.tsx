"use client";

import { Search, X, Loader2, Tag } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Mock data for search results
type Product = {
   id: string;
   title: string;
   category: string;
   price: number;
   image: string;
};

const mockProducts: Product[] = [
   {
      id: "1",
      title: "Modern Portfolio Template",
      category: "Portfolio",
      price: 49,
      image: "/images/portfolio-template.jpg" // You'll need placeholder images
   },
   {
      id: "2",
      title: "E-commerce Store Theme",
      category: "E-commerce",
      price: 79,
      image: "/images/ecommerce-template.jpg"
   },
   {
      id: "3",
      title: "Professional Blog Theme",
      category: "Blog",
      price: 39,
      image: "/images/blog-template.jpg"
   },
   {
      id: "4",
      title: "Landing Page Builder",
      category: "Landing Page",
      price: 59,
      image: "/images/landing-template.jpg"
   }
];

const SearchContainer = ({ setIsSearchOpen }: {
   setIsSearchOpen: (value: boolean) => void
}) => {
   const [searchQuery, setSearchQuery] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [recentSearches, setRecentSearches] = useState<string[]>([]);
   const [searchResults, setSearchResults] = useState<Product[]>([]);
   const [hasSearched, setHasSearched] = useState(false);
   const inputRef = useRef<HTMLInputElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const resultsRef = useRef<HTMLDivElement>(null);
   const router = useRouter();

   // Focus input on mount
   useEffect(() => {
      inputRef.current?.focus();

      // Load recent searches from localStorage
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
         setRecentSearches(JSON.parse(savedSearches));
      }

      // Add event listener for escape key
      const handleEscKey = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            setIsSearchOpen(false);
         }
      };

      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
   }, [setIsSearchOpen]);

   // Scroll to results when they appear
   useEffect(() => {
      if (searchResults.length > 0 && resultsRef.current) {
         resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
   }, [searchResults]);

   // Prevent closing when clicking inside the container
   const handleContainerClick = (e: React.MouseEvent) => {
      e.stopPropagation();
   };

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      setIsLoading(true);
      setHasSearched(true);

      // Save to recent searches
      const updatedSearches = [
         searchQuery,
         ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

      // Simulate search with mock data
      setTimeout(() => {
         setIsLoading(false);

         // Filter mock products based on search query
         const filtered = mockProducts.filter(product =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
         );

         setSearchResults(filtered);
      }, 500);
   };

   const clearRecentSearches = () => {
      setRecentSearches([]);
      localStorage.removeItem('recentSearches');
   };

   const performSearch = (query: string) => {
      setSearchQuery(query);
      const event = new Event('submit') as unknown as React.FormEvent;
      handleSearch(event);
   };

   const handleProductClick = (product: Product) => {
      router.push(`/product/${product.id}`);
      setIsSearchOpen(false);
   };

   return (
      <div
         onClick={() => setIsSearchOpen(false)}
         className="fixed inset-0 w-full h-screen bg-glass/95 backdrop-blur-sm flex items-start justify-center pt-16 px-4 z-50 animate-fadeIn overflow-y-auto"
      >
         <div
            ref={containerRef}
            onClick={handleContainerClick}
            className="w-full max-w-3xl bg-background-secondary border border-theme rounded-lg shadow-xl animate-slideDown p-5 mb-16"
         >
            {/* Close button */}
            <button
               onClick={() => setIsSearchOpen(false)}
               className="absolute top-3 right-3 p-2 rounded-full hover:bg-accent text-secondary hover:text-primary transition-colors"
               aria-label="Close search"
            >
               <X className="w-5 h-5" />
            </button>

            {/* Search form */}
            <form onSubmit={handleSearch} className="relative">
               <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search website templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 pr-12 rounded-md bg-background border border-theme text-primary focus:outline-none focus:ring-2 focus:ring-highlight focus:border-highlight transition-all"
               />
               <button
                  type="submit"
                  className="absolute right-3 top-3 text-secondary hover:text-primary disabled:opacity-50"
                  disabled={isLoading || !searchQuery.trim()}
               >
                  {isLoading ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                     <Search className="w-5 h-5" />
                  )}
               </button>
            </form>

            {/* Popular searches - only show if not displaying results */}
            {!hasSearched && (
               <div className="mt-4 p-3 bg-accent/20 rounded-md">
                  <div className="flex flex-wrap gap-2 text-sm text-secondary">
                     <span>Popular:</span>
                     <button
                        onClick={() => performSearch('portfolio')}
                        className="hover:text-highlight transition-colors"
                     >
                        Portfolio
                     </button>
                     <button
                        onClick={() => performSearch('ecommerce')}
                        className="hover:text-highlight transition-colors"
                     >
                        E-commerce
                     </button>
                     <button
                        onClick={() => performSearch('blog')}
                        className="hover:text-highlight transition-colors"
                     >
                        Blog
                     </button>
                     <button
                        onClick={() => performSearch('landing page')}
                        className="hover:text-highlight transition-colors"
                     >
                        Landing Page
                     </button>
                  </div>
               </div>
            )}

            {/* Recent searches - only show if not displaying results */}
            {!hasSearched && (
               <div className="mt-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-md font-medium text-primary">Recent Searches</h4>
                     {recentSearches.length > 0 && (
                        <button
                           onClick={clearRecentSearches}
                           className="text-sm text-secondary hover:text-highlight transition-colors"
                        >
                           Clear All
                        </button>
                     )}
                  </div>
                  <div className="mt-2">
                     {recentSearches.length > 0 ? (
                        <ul className="space-y-1">
                           {recentSearches.map((search, index) => (
                              <li key={index}>
                                 <button
                                    onClick={() => performSearch(search)}
                                    className="w-full text-left p-2 hover:bg-accent rounded-md text-primary flex items-center"
                                 >
                                    <Search className="w-4 h-4 mr-2 text-secondary" />
                                    {search}
                                 </button>
                              </li>
                           ))}
                        </ul>
                     ) : (
                        <p className="text-secondary text-sm italic p-2">No recent searches</p>
                     )}
                  </div>
               </div>
            )}

            {/* Search Results Section */}
            {hasSearched && (
               <div ref={resultsRef} className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-md font-medium text-primary">
                        {isLoading ? 'Searching...' : `Results for "${searchQuery}"`}
                     </h4>
                     <button
                        onClick={() => {
                           setHasSearched(false);
                           setSearchResults([]);
                        }}
                        className="text-sm text-secondary hover:text-highlight transition-colors"
                     >
                        Back to Search
                     </button>
                  </div>

                  {/* Loading indicator */}
                  {isLoading && (
                     <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-highlight" />
                     </div>
                  )}

                  {/* No results message */}
                  {!isLoading && searchResults.length === 0 && hasSearched && (
                     <div className="py-8 text-center">
                        <p className="text-secondary mb-2">No templates found for "{searchQuery}"</p>
                        <p className="text-sm text-secondary">Try another search term or browse our categories</p>
                     </div>
                  )}

                  {/* Results grid */}
                  {!isLoading && searchResults.length > 0 && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        {searchResults.map((product) => (
                           <div
                              key={product.id}
                              onClick={() => handleProductClick(product)}
                              className="bg-accent/10 rounded-lg overflow-hidden border border-theme hover:border-highlight cursor-pointer transition-all hover:shadow-md"
                           >
                              <div className="h-32 bg-accent/20 relative">
                                 {/* Replace with actual images when you have them */}
                                 <div className="absolute inset-0 flex items-center justify-center text-secondary">
                                    <span className="text-sm">{product.title} Preview</span>
                                 </div>
                              </div>
                              <div className="p-3">
                                 <div className="flex justify-between items-start">
                                    <h5 className="font-medium text-primary">{product.title}</h5>
                                    <span className="text-highlight font-bold">${product.price}</span>
                                 </div>
                                 <div className="flex items-center mt-2">
                                    <Tag className="w-3 h-3 mr-1 text-secondary" />
                                    <span className="text-xs text-secondary">{product.category}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}

export default SearchContainer
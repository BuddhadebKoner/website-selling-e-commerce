"use client";

import { FilterOption, productTypeFilters } from '@/config/filterOptions';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Add All Products filter option and memoize to prevent recreation
const allFilters: FilterOption[] = [
  { type: 'all', value: 'all', label: 'All Products' },
  ...productTypeFilters
];

// Create a lookup map for faster filter matching
const filterLookup = Object.fromEntries(
  allFilters.map(filter => [filter.value, filter])
);

const TemplatesLayout = ({ children }: {
  children: React.ReactNode
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state for active filter
  const [activeFilter, setActiveFilter] = useState<FilterOption>(allFilters[0]);

  // Extract product type from URL path - memoized to avoid recalculation
  const currentProductType = useMemo(() => {
    if (!pathname) return 'all';
    const segments = pathname.split('/');
    return segments.length >= 3 ? segments[2] : 'all';
  }, [pathname]);

  // Update active filter based on URL path - only when needed
  useEffect(() => {
    const matchingFilter = filterLookup[currentProductType] || allFilters[0];
    if (activeFilter.value !== matchingFilter.value) {
      setActiveFilter(matchingFilter);
    }
  }, [currentProductType, activeFilter.value]);

  // Memoize the filter change handler to prevent recreation on renders
  const handleFilterChange = useCallback((filter: FilterOption) => {
    // Don't update if already on the same filter
    if (filter.value === activeFilter.value) return;

    setActiveFilter(filter);

    // Navigate to the appropriate route with shallow routing when possible
    const targetPath = filter.value === 'all'
      ? '/templates'
      : `/templates/${encodeURIComponent(filter.value)}`;

    router.push(targetPath);
  }, [activeFilter.value, router]);

  // Memoize the filter buttons to prevent unnecessary re-renders
  const filterButtons = useMemo(() => (
    <div className="flex overflow-x-auto whitespace-nowrap space-x-2 py-5">
      {allFilters.map((filter) => (
        <button
          key={`${filter.type}-${filter.value}`}
          className={`btn ${activeFilter.value === filter.value ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleFilterChange(filter)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  ), [activeFilter.value, handleFilterChange]);

  return (
    <div className="w-full min-h-screen bg-background pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center overflow-y-hidden">
      <div className="w-full max-w-7xl">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {filterButtons}
          {children}
        </main>
      </div>
    </div>
  );
};

export default TemplatesLayout;
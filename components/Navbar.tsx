"use client";

import { CircleUser, Contact, House, Monitor, Moon, Search, ShoppingBag, ShoppingCart, Sun, TextSearch, User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeProvider';
import { SignInButton } from '@clerk/nextjs';
import SearchContainer from './SearchContainer';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleTheme = (selectedTheme: string) => {
    toggleTheme(selectedTheme);
    setIsDropdownOpen(false);
  };

  // Handle keyboard navigation for theme dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index?: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (index === undefined) {
        buttonRefs.current[0]?.focus();
      } else if (index < 2) {
        buttonRefs.current[index + 1]?.focus();
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (index === undefined) {
        buttonRefs.current[2]?.focus();
      } else if (index > 0) {
        buttonRefs.current[index - 1]?.focus();
      } else if (index === 0) {
        const toggleButton = dropdownRef.current?.querySelector('button[aria-label="Toggle Theme"]') as HTMLButtonElement;
        toggleButton?.focus();
      }
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (index === undefined) {
        setIsDropdownOpen(!isDropdownOpen);
      } else {
        e.currentTarget.click();
      }
    }

    if (e.key === "Escape" && isDropdownOpen) {
      e.preventDefault();
      setIsDropdownOpen(false);
      const toggleButton = dropdownRef.current?.querySelector('button[aria-label="Toggle Theme"]') as HTMLButtonElement;
      toggleButton?.focus();
    }
  };

  // if isSearchOpen open then off scroll to body
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isSearchOpen]);

  return (
    <nav className="fixed w-full z-100 bg-glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Logo and main navigation */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-highlight hidden sm:inline">Web Store</span>
          </Link>

          <div className="hidden md:flex md:space-x-4 ml-6">
            <Link
              href="/shop"
              className="text-primary hover:text-highlight flex items-center space-x-2 px-3 py-2 rounded-md transition-colors"
            >
              <span>Templates</span>
            </Link>
            <Link
              href="/categories"
              className="text-primary hover:text-highlight flex items-center space-x-2 px-3 py-2 rounded-md transition-colors"
            >
              <span>Categories</span>
            </Link>
            <Link
              href="/resource"
              className="text-primary hover:text-highlight flex items-center space-x-2 px-3 py-2 rounded-md transition-colors"
            >
              <span>Resources</span>
            </Link>
            <Link
              href="/offers"
              className="text-primary hover:text-highlight flex items-center space-x-2 px-3 py-2 rounded-md transition-colors"
            >
              {/* 50% off */}
              <span>Offers</span>
            </Link>
          </div>
        </div>

        {/* Right side - search, auth, cart */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-primary" />
          </button>

          {/* Cart with badge */}
          <Link
            href="/cart"
            className="p-2 hover:bg-accent rounded-full transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="absolute top-0 right-0 bg-highlight-secondary text-primary text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Link>

          {/* Auth */}
          <SignInButton mode='modal'>
            <button className="hidden sm:flex items-center space-x-2 bg-highlight text-primary px-4 py-2 rounded-md hover:bg-link-hover transition-colors cursor-pointer">
              <CircleUser className="w-5 h-5" />
            </button>
          </SignInButton>

          {/* Theme Toggle */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={(e) => handleKeyDown(e)}
              className="p-2 rounded-full hover:bg-accent focus:outline-none transition-colors"
              aria-label="Toggle Theme"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : theme === "dark" ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Monitor className="w-5 h-5 text-primary" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 dropdown-glass rounded-md shadow-lg py-1 z-100">
                <button
                  ref={(el) => {
                    buttonRefs.current[0] = el;
                  }}
                  onClick={() => handleToggleTheme("light")}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  className={`${theme === "light" ? "bg-accent" : ""} flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent text-primary`}
                  role="menuitem"
                >
                  <Sun className="w-4 h-4 mr-3" />
                  Light
                </button>
                <button
                  ref={(el) => {
                    buttonRefs.current[1] = el;
                  }}
                  onClick={() => handleToggleTheme("dark")}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  className={`${theme === "dark" ? "bg-accent" : ""} flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent text-primary`}
                  role="menuitem"
                >
                  <Moon className="w-4 h-4 mr-3" />
                  Dark
                </button>
                <button
                  ref={(el) => {
                    buttonRefs.current[2] = el;
                  }}
                  onClick={() => handleToggleTheme("system")}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                  className={`${theme === "system" ? "bg-accent" : ""} flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent text-primary`}
                  role="menuitem"
                >
                  <Monitor className="w-4 h-4 mr-3" />
                  System
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <SearchContainer
          setIsSearchOpen={setIsSearchOpen}
        />
      )}
    </nav>
  );
};

export default Navbar;
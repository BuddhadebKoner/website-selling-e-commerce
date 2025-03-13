"use client";

import { CircleUser, Contact, House, Monitor, Moon, Search, ShieldCheck, ShoppingBag, ShoppingCart, Sun, TextSearch, User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeProvider';
import { SignInButton, UserButton, SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import SearchContainer from './SearchContainer';
import { useAuth } from '@/context/AuthProvider';
import Image from 'next/image';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Get authentication data from context
  const { currentUser, isAdmin, isLoading } = useAuth();
  const { signOut } = useClerk();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
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

          {/* Auth - Show based on currentUser from context */}
          {isLoading ? (
            // Loading state
            <div className="w-8 h-8 rounded-full bg-background-secondary animate-pulse"></div>
          ) : currentUser ? (
            // User is logged in - show user menu
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative flex rounded-full bg-background-secondary text-sm focus:outline-none focus:ring-2 focus:ring-highlight-primary"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                {currentUser.imageUrl ? (
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={currentUser.imageUrl}
                    alt={currentUser.fullName || "User avatar"}
                    width={32}
                    height={32}
                  />
                ) : (
                  <CircleUser className="h-8 w-8 text-primary" />
                )}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent-green ring-1 ring-white"></span>
                {/* Admin dot indicator on avatar */}
                {isAdmin && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-amber-200 ring-1 ring-white"></span>
                )}
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 dropdown-glass rounded-md shadow-lg py-1 z-100">
                  <div className="px-4 py-2 border-b border-theme">
                    <p className="text-sm font-medium text-primary">{currentUser.fullName}</p>
                    <p className="text-xs text-secondary truncate">{currentUser.email}</p>
                    {isAdmin && (
                      <div className="flex items-center mt-1 text-accent-green">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        <span className="text-xs">Admin</span>
                      </div>
                    )}
                  </div>

                  <Link href="/profile" className="block px-4 py-2 text-sm text-primary hover:bg-accent">
                    Your Profile
                  </Link>

                  {isAdmin && (
                    <Link href="/admin-dashbord" className="block px-4 py-2 text-sm text-primary hover:bg-accent">
                      Admin Dashboard
                    </Link>
                  )}

                  <Link href="/orders" className="block px-4 py-2 text-sm text-primary hover:bg-accent">
                    Your Orders
                  </Link>

                  {/* sign out */}
                    <button
                      className='block px-4 py-2 text-sm text-primary hover:bg-accent'
                      onClick={() => signOut({ redirectUrl: '/' })}>
                      Sign out
                    </button>
                </div>
              )}
            </div>
          ) : (
            // User is not logged in - show sign in/up buttons
            <div className="flex items-center space-x-2">
              <Link
                href="/sign-in"
                className="text-primary hover:text-highlight text-sm px-3 py-1 rounded-md transition-colors"
              >
                Sign in
              </Link>
            </div>
          )}

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
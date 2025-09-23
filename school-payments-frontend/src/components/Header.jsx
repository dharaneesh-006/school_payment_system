import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon, // Burger icon
  XMarkIcon, // Close icon
} from "@heroicons/react/24/outline";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu visibility

  // Reusable navigation items
  const navItems = [
    { path: "/transactions", label: "Transactions" },
    { path: "/check-status", label: "Check Status" },
  ];

  // Styling for desktop navigation links
  const navLinkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white"
        : "text-gray-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
    }`;

  // Styling for mobile navigation links
  const mobileNavLinkClass = (path) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      location.pathname === path
        ? "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white"
        : "text-gray-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
    }`;

  return (
    // Add 'relative' to allow absolute positioning of the dropdown
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 left-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400"
              onClick={() => setIsMenuOpen(false)} // Close menu on logo click
            >
              SchoolPayments
            </Link>
            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex ml-10 space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={navLinkClass(item.path)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-blue-500" />
              )}
            </button>
            {isAuthenticated && (
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-500" />
              </button>
            )}

            {/* Mobile Menu Burger Icon */}
            {isAuthenticated && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700"
                  aria-controls="mobile-menu"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && isAuthenticated && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={mobileNavLinkClass(item.path)}
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

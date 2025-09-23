import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white"
        : "text-gray-500 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
    }`;

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400"
            >
              SchoolPayments
            </Link>
            {isAuthenticated && (
              <nav className="hidden md:flex ml-10 space-x-4">
                <Link
                  to="/transactions"
                  className={navLinkClass("/transactions")}
                >
                  Transactions
                </Link>
                <Link to="/by-school" className={navLinkClass("/by-school")}>
                  By School
                </Link>
                <Link
                  to="/check-status"
                  className={navLinkClass("/check-status")}
                >
                  Check Status
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              {theme === "dark" ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
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
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, LogOut } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useThemeContext } from '@/context/ThemeContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const { user, setUser } = useAppContext();
  const { isDarkMode, toggleTheme } = useThemeContext();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('http://localhost:3500/api/users/logout', {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        console.error(data.message);
        return;
      }
      if (res.ok) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-lg font-semibold font-serif text-gray-800 dark:text-white">
                Property<br />Management
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              {user?.accountType === 'owner' &&
                <Link to="/dashboard/create-property" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Create Property
                </Link>
              }
              <Link to="/profile" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <button
              className="ml-3 rounded-md p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white dark:text-gray-300 dark:hover:text-white"
              aria-label="Logout"
              onClick={handleSignout}
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="ml-3 md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white dark:text-gray-300 dark:hover:text-white"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link to="/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Dashboard
            </Link>
            {user?.accountType === 'owner' &&
              <Link to="/dashboard/create-property" className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Create Property
              </Link>
            }
            <Link to="/profile" className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

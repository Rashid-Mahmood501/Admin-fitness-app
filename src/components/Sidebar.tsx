'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: 'Meal Plans',
      href: '/admin/meal-plans',
      icon: '🍽️'
    },
    {
      name: 'Personalized Meal Plans',
      href: '/admin/personalized',
      icon: '👤'
    },
    {
      name: 'Workout Plans',
      href: '/admin/workout-plans',
      icon: '💪'
    },
    {
      name: 'Personalized Workout Plans',
      href: '/admin/personalized-workout',
      icon: '💪'
    },
    {
      name: 'Supplements',
      href: '/admin/supplements',
      icon: '💊'
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: '📅'
    }
  ];

  // Helper function to check if a route is active
  const isRouteActive = (href: string) => {
    // Remove trailing slashes for comparison
    const cleanPathname = pathname?.replace(/\/$/, '') || '';
    const cleanHref = href.replace(/\/$/, '');

    // Check for exact match or if pathname starts with the href (for nested routes)
    return cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref + '/');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#171616] text-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#171616] text-white shadow-lg transform transition-transform duration-300 ease-in-out`}>
        <div className="p-6 h-full flex flex-col">
          <h1 className="text-2xl font-bold text-[#EC1D13] mb-8">Admin Panel</h1>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-[#EC1D13] text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 
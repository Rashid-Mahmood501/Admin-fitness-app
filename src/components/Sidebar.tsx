'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Meal Plans',
      href: '/admin/meal-plans',
      icon: '🍽️'
    },
    {
      name: 'Workout Plans',
      href: '/admin/workout-plans',
      icon: '💪'
    },
    {
      name: 'Supplements',
      href: '/admin/supplements',
      icon: '💊'
    }
  ];

  return (
    <div className="w-64 h-screen bg-[#171616] text-white fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#EC1D13] mb-8">Admin Panel</h1>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
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
  );
};

export default Sidebar; 
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400';
  };

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link 
        href="/" 
        className="font-bold text-xl text-gray-900 dark:text-white"
      >
        SwiftToken
      </Link>
      
      <div className="flex gap-6">
        <Link 
          href="/" 
          className={`${isActive('/')} hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
        >
          Generate
        </Link>
        <Link 
          href="/dashboard" 
          className={`${isActive('/dashboard')} hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
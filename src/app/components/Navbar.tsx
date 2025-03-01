'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xs bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-content">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">CrowdFunded</span>
            </Link>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/projects" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Projects
            </Link>
            <Link 
              href="/start" 
              className="ml-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded-md text-sm font-medium shadow-xs"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 
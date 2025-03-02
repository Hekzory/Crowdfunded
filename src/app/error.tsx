'use client'; // Error components must be Client components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold dark:text-red-500 mb-4">Oops!</h1>
        <h2 className="text-3xl font-semibold dark:text-white mb-4">Something went wrong</h2>
        <p className="dark:text-gray-300 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="dark:bg-indigo-500 text-white dark:hover:bg-indigo-600 px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Try again
          </button>
          <Link 
            href="/"
            className="dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700 px-6 py-3 rounded-full font-semibold transition-colors border-2 dark:border-indigo-400"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
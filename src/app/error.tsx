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
        <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Try again
          </button>
          <Link 
            href="/"
            className="bg-white text-indigo-600 hover:bg-gray-50 px-6 py-3 rounded-full font-semibold transition-colors border-2 border-indigo-600"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
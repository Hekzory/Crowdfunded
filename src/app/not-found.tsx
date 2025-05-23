import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold dark:text-indigo-400 mb-4">404</h1>
        <h2 className="text-3xl font-semibold dark:text-white mb-4">Page Not Found</h2>
        <p className="dark:text-gray-300 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for is still under construction or doesn&apos;t exist.
          We&apos;re working hard to bring more features to CrowdFunded.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center dark:bg-indigo-500 text-white dark:hover:bg-indigo-600 px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
} 
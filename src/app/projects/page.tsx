import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectsList from '@/app/components/ProjectsList';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/auth';

export const metadata: Metadata = {
  title: 'Explore Projects | CrowdFunded',
  description: 'Discover innovative projects and ideas to fund on CrowdFunded',
};

export default async function ProjectsPage() {
  // Check authentication
  const user = await getCurrentUser();
  
  if (!user) {
    // Redirect to login page if user is not authenticated
    redirect('/login?redirectTo=' + encodeURIComponent('/projects'));
  }
  
  return (
    <div className="max-w-content py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Explore Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Discover innovative projects created by passionate creators from around the world, and help bring their ideas to life.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/projects/new"
            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 dark:bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Project
          </Link>
        </div>
      </div>
      
      <ProjectsList />
    </div>
  );
} 
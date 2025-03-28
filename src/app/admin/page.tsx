'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalFunding: 0
  });

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || (user?.name !== 'admin'))) {
      router.push('/');
    }

    // Fetch admin stats if user is admin
    if (isAuthenticated && user?.name === 'admin') {
      fetchAdminStats();
    }
  }, [user, loading, isAuthenticated, router]);

  async function fetchAdminStats() {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not admin, this will redirect, but we need to return something
  if (!isAuthenticated || user?.name !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalProjects}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Total Funding</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${stats.totalFunding.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/admin/users" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Manage Users
          </Link>
          <Link 
            href="/admin/projects" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Manage Projects
          </Link>
        </div>
      </div>
    </div>
  );
} 
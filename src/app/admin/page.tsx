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
  const [paymentEnabled, setPaymentEnabled] = useState(true);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [paymentUpdateError, setPaymentUpdateError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || (user?.name !== 'admin'))) {
      router.push('/');
    }

    // Fetch admin stats if user is admin
    if (isAuthenticated && user?.name === 'admin') {
      fetchAdminStats();
      fetchPaymentSettings();
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

  async function fetchPaymentSettings() {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setPaymentEnabled(data.test_payment_enabled === 'true');
      }
    } catch (error) {
      console.error('Failed to fetch payment settings:', error);
    }
  }

  async function togglePaymentSystem() {
    setIsUpdatingPayment(true);
    setPaymentUpdateError(null);
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'test_payment_enabled',
          value: !paymentEnabled,
        }),
      });
      
      if (response.ok) {
        setPaymentEnabled(!paymentEnabled);
      } else {
        const data = await response.json();
        setPaymentUpdateError(data.error || 'Failed to update payment settings');
      }
    } catch (error) {
      setPaymentUpdateError('An error occurred while updating payment settings');
      console.error('Failed to update payment settings:', error);
    } finally {
      setIsUpdatingPayment(false);
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
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment System</h2>
        
        {paymentUpdateError && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {paymentUpdateError}
          </div>
        )}
        
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
          <div>
            <h3 className="font-medium">Test Payment System</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {paymentEnabled 
                ? 'Users can make test contributions to projects' 
                : 'Test contributions are currently disabled'}
            </p>
          </div>
          <button
            onClick={togglePaymentSystem}
            disabled={isUpdatingPayment}
            className={`px-4 py-2 rounded ${
              paymentEnabled
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } ${isUpdatingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isUpdatingPayment 
              ? 'Updating...' 
              : paymentEnabled 
                ? 'Disable Payments' 
                : 'Enable Payments'}
          </button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
          Note: This is a test payment system for development purposes.
        </p>
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
          <Link 
            href="/admin/contributions" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            View Contributions
          </Link>
        </div>
      </div>
    </div>
  );
} 
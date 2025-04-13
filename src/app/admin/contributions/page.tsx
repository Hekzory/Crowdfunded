'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

interface Contribution {
  id: number;
  amount: number;
  created_at: string;
  project_id: number;
  project_title: string;
  project_status: string;
  user_id: number;
  user_name: string;
  user_email: string;
}

export default function AdminContributionsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentEnabled, setPaymentEnabled] = useState(true);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || (user?.name !== 'admin'))) {
      router.push('/');
    }

    // Fetch contributions if user is admin
    if (isAuthenticated && user?.name === 'admin') {
      fetchContributions();
      fetchPaymentSettings();
    }
  }, [user, loading, isAuthenticated, router]);

  async function fetchContributions() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/contributions');
      if (response.ok) {
        const data = await response.json();
        setContributions(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch contributions');
      }
    } catch (error) {
      setError('An error occurred while fetching contributions');
      console.error('Failed to fetch contributions:', error);
    } finally {
      setIsLoading(false);
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
        setError(data.error || 'Failed to update payment settings');
      }
    } catch (error) {
      setError('An error occurred while updating payment settings');
      console.error('Failed to update payment settings:', error);
    } finally {
      setIsUpdatingPayment(false);
    }
  }

  const filteredContributions = contributions.filter(c => {
    const matchesSearch = 
      c.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalAmount = filteredContributions.reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0);

  // Show loading state
  if (loading || isLoading) {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Contributions</h1>
        <Link
          href="/admin"
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="w-full md:w-auto flex-1">
            <input
              type="text"
              placeholder="Search by project title, user name, or email..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto">
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
        </div>
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
          <div>
            <span className="font-medium">Payment System Status: </span>
            <span className={`${paymentEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {paymentEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div>
            <span className="font-medium mr-2">Filtered Contributions Total:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">${totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContributions.map((contribution) => (
                <tr key={contribution.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(contribution.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{contribution.user_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{contribution.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/projects/${contribution.project_id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                    >
                      {contribution.project_title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-semibold">
                    ${contribution.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${contribution.project_status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                      contribution.project_status === 'completed' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 
                      contribution.project_status === 'rejected' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                      {contribution.project_status.charAt(0).toUpperCase() + contribution.project_status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredContributions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                    No contributions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
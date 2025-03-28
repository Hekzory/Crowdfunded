'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  provider: string;
  created_at: string;
  profile_picture?: string;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || (user?.name !== 'admin'))) {
      router.push('/');
    }

    // Fetch user if user is admin
    if (isAuthenticated && user?.name === 'admin') {
      fetchUser();
    }
  }, [user, loading, isAuthenticated, router, params.id]);

  async function fetchUser() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormValues({
          name: data.name,
          email: data.email,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch user');
      }
    } catch (error) {
      setError('An error occurred while fetching user');
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      
      if (response.ok) {
        setSuccess('User updated successfully');
        // Update local userData
        if (userData) {
          setUserData({
            ...userData,
            name: formValues.name,
            email: formValues.email,
          });
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update user');
      }
    } catch (error) {
      setError('An error occurred while updating user');
      console.error('Failed to update user:', error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not admin, this will redirect, but we need to return something
  if (!isAuthenticated || user?.name !== 'admin' || !userData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit User</h1>
        <Link
          href="/admin/users"
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded"
        >
          Back to Users
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="text-center">
              {userData.profile_picture ? (
                <img 
                  src={userData.profile_picture} 
                  alt={userData.name} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <span className="text-indigo-500 dark:text-indigo-300 text-4xl">{userData.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
              <p className="mt-2 text-sm">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  {userData.provider}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Joined {new Date(userData.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
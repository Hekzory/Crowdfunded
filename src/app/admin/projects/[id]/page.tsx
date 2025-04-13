'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  image_url?: string;
  user_id: number;
  status: string;
  created_at: string;
  user_name?: string;
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    goal_amount: 0,
    status: '',
    image_url: '',
  });

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || (user?.name !== 'admin'))) {
      router.push('/');
    }

    // Fetch project if user is admin
    if (isAuthenticated && user?.name === 'admin') {
      fetchProject();
    }
  }, [user, loading, isAuthenticated, router, params.id]);

  async function fetchProject() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProjectData(data);
        setFormValues({
          title: data.title,
          description: data.description,
          goal_amount: data.goal_amount,
          status: data.status,
          image_url: data.image_url || '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch project');
      }
    } catch (error) {
      setError('An error occurred while fetching project');
      console.error('Failed to fetch project:', error);
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
      const response = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      
      if (response.ok) {
        setSuccess('Project updated successfully');
        // Update local projectData
        if (projectData) {
          setProjectData({
            ...projectData,
            title: formValues.title,
            description: formValues.description,
            goal_amount: formValues.goal_amount,
            status: formValues.status,
            image_url: formValues.image_url,
          });
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update project');
      }
    } catch (error) {
      setError('An error occurred while updating project');
      console.error('Failed to update project:', error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'goal_amount' ? parseFloat(value) : value
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
  if (!isAuthenticated || user?.name !== 'admin' || !projectData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <Link
          href="/admin/projects"
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded"
        >
          Back to Projects
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
              {projectData.image_url ? (
                <img 
                  src={projectData.image_url} 
                  alt={projectData.title} 
                  className="w-64 h-48 mx-auto mb-4 object-cover rounded"
                />
              ) : (
                <div className="w-64 h-48 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center rounded">
                  <span className="text-indigo-500 dark:text-indigo-300 text-4xl">{projectData.title.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <h2 className="text-xl font-semibold">{projectData.title}</h2>
              <p className="text-gray-500 dark:text-gray-400">Creator: {projectData.user_name || `User ID: ${projectData.user_id}`}</p>
              <p className="mt-2">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${projectData.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                  projectData.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 
                  projectData.status === 'rejected' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 
                  'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                  {projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1)}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Created: {new Date(projectData.created_at).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Current funding: ${projectData.current_amount.toLocaleString()} of ${projectData.goal_amount.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="goal_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Amount ($)
                </label>
                <input
                  type="number"
                  id="goal_amount"
                  name="goal_amount"
                  value={formValues.goal_amount}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formValues.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={formValues.image_url}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
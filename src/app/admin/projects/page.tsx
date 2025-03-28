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

export default function ManageProjectsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || (user?.name !== 'admin'))) {
      router.push('/');
    }

    // Fetch projects if user is admin
    if (isAuthenticated && user?.name === 'admin') {
      fetchProjects();
    }
  }, [user, loading, isAuthenticated, router]);

  async function fetchProjects() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch projects');
      }
    } catch (error) {
      setError('An error occurred while fetching projects');
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteProject() {
    if (!projectToDelete) return;
    
    try {
      const response = await fetch(`/api/admin/projects/${projectToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove project from state
        setProjects(projects.filter(p => p.id !== projectToDelete));
        setShowDeleteModal(false);
        setProjectToDelete(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete project');
      }
    } catch (error) {
      setError('An error occurred while deleting project');
      console.error('Failed to delete project:', error);
    }
  }

  async function handleUpdateStatus(projectId: number, newStatus: string) {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Update project status in state
        setProjects(projects.map(p => 
          p.id === projectId ? { ...p, status: newStatus } : p
        ));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update project status');
      }
    } catch (error) {
      setError('An error occurred while updating project status');
      console.error('Failed to update project status:', error);
    }
  }

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold">Manage Projects</h1>
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

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="md:w-2/3">
            <input
              type="text"
              placeholder="Search projects by title..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-1/3">
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Funding</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.image_url ? (
                        <img className="h-10 w-10 rounded mr-3 object-cover" src={project.image_url} alt={project.title} />
                      ) : (
                        <div className="h-10 w-10 rounded bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                          <span className="text-indigo-500 dark:text-indigo-300">{project.title.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {project.user_name || `User #${project.user_id}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={project.status}
                      onChange={(e) => handleUpdateStatus(project.id, e.target.value)}
                      className="text-xs leading-5 font-semibold rounded px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ${project.current_amount.toLocaleString()} / ${project.goal_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(project.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/projects/${project.id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setProjectToDelete(project.id);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
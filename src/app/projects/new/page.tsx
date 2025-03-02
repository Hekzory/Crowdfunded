'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: '',
    creator_name: '',
    image_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate form
      if (!formData.title || !formData.description || !formData.goal_amount || !formData.creator_name) {
        throw new Error('Please fill in all required fields');
      }
      
      // Convert goal amount to a number
      const goalAmount = parseFloat(formData.goal_amount);
      if (isNaN(goalAmount) || goalAmount <= 0) {
        throw new Error('Goal amount must be a positive number');
      }
      
      // Create the project
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          goal_amount: goalAmount,
          status: 'draft', // Always create as draft
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }
      
      const result = await response.json();
      
      // Redirect to the new project page
      router.push(`/projects/${result.project.id}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-content py-12">
      <div className="mb-8">
        <Link href="/projects" className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Projects
        </Link>
      </div>
      
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Create New Project
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Fill out the form below to create your new project. Your project will start in draft mode, allowing you to review before making it public.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Enter a catchy title for your project"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Describe your project in detail"
            />
          </div>
          
          <div>
            <label htmlFor="goal_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Funding Goal (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="goal_amount"
              name="goal_amount"
              value={formData.goal_amount}
              onChange={handleChange}
              required
              min="1"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Enter your funding goal amount"
            />
          </div>
          
          <div>
            <label htmlFor="creator_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Creator Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="creator_name"
              name="creator_name"
              value={formData.creator_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Enter your name or organization name"
            />
          </div>
          
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Enter a URL for your project image (optional)"
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-md font-medium text-white transition-colors
              ${isSubmitting 
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600'
              }`}
          >
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </button>
        </div>
      </form>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-2">What happens next?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          After creating your project, it will be saved as a draft. You can review all details and make any necessary changes.
          When you're ready to launch, you can use the "Start Project" button to make it public and begin accepting funding.
        </p>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StartProjectButtonProps {
  projectId: number;
  currentStatus: string;
}

export default function StartProjectButton({ projectId, currentStatus }: StartProjectButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show the button if the project is in draft status
  if (currentStatus !== 'draft') {
    return null;
  }

  const handleStartProject = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/projects/${projectId}/start`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start project');
      }
      
      // Refresh the page to show updated status
      router.refresh();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
      
      <button
        onClick={handleStartProject}
        disabled={isLoading}
        type="button"
        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors
          ${isLoading 
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
            : 'bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600'
          }`}
      >
        {isLoading ? 'Starting Project...' : 'Start Project'}
      </button>
      
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Starting a project will make it visible to the public and allow it to receive funding.
        This action cannot be undone.
      </p>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

interface Project {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  image_url: string;
  creator_name: string;
  status: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl h-96" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error</h3>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="mt-12 text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
        <p className="text-gray-600 dark:text-gray-300">Check back later for new projects.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.title}
          description={project.description}
          goalAmount={Number(project.goal_amount)}
          currentAmount={Number(project.current_amount)}
          imageUrl={project.image_url || ''}
          creatorName={project.creator_name}
          status={project.status}
        />
      ))}
    </div>
  );
}
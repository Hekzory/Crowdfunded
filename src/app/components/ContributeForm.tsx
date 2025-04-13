'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface ContributeFormProps {
  projectId: number;
  projectTitle: string;
  onSuccess?: (amount: number) => void;
}

export default function ContributeForm({ projectId, projectTitle, onSuccess }: ContributeFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!isAuthenticated) {
      setError('Please log in to contribute to this project');
      return;
    }
    
    // Validate amount
    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      setError('Please enter a valid contribution amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/projects/${projectId}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: contributionAmount }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message || 'Thank you for your contribution!');
        setAmount('');
        if (onSuccess) {
          onSuccess(contributionAmount);
        }
      } else {
        setError(data.error || 'Failed to process your contribution');
      }
    } catch (error) {
      setError('An error occurred while processing your contribution');
      console.error('Contribution error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Support This Project</h3>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3 py-2 rounded mb-4 text-sm">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contribution Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
            placeholder="Enter amount"
            disabled={isSubmitting}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Note: This is a test payment system and no real transactions will occur.
        </p>
        <button
          type="submit"
          disabled={isSubmitting || !isAuthenticated}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded ${
            isSubmitting || !isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Processing...' : `Support ${projectTitle}`}
        </button>
        
        {!isAuthenticated && (
          <p className="text-xs text-center mt-2 text-red-500 dark:text-red-400">
            Please log in to contribute to this project
          </p>
        )}
      </form>
    </div>
  );
} 
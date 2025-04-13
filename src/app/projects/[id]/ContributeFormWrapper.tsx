'use client';

import { useState } from 'react';
import ContributeForm from '@/app/components/ContributeForm';

interface ContributeFormWrapperProps {
  projectId: number;
  projectTitle: string;
}

export default function ContributeFormWrapper({ projectId, projectTitle }: ContributeFormWrapperProps) {
  const [currentAmount, setCurrentAmount] = useState<number | null>(null);
  
  // This function will be called after successful contribution
  const handleContributionSuccess = (amount: number) => {
    // We'll use this to immediately update the UI with the new contribution
    setCurrentAmount(amount);
    
    // Optional: refresh the page after a short delay to get updated project data
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  
  return (
    <ContributeForm 
      projectId={projectId} 
      projectTitle={projectTitle}
      onSuccess={handleContributionSuccess}
    />
  );
} 
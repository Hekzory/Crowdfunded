import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  imageUrl: string;
  creatorName: string;
  status?: string;
}

export default function ProjectCard({
  id,
  title,
  description,
  goalAmount,
  currentAmount,
  imageUrl,
  creatorName,
  status = 'active', // Default to active if not provided for backward compatibility
}: ProjectCardProps) {
  // Calculate progress percentage
  const progress = Math.min(Math.round((currentAmount / goalAmount) * 100), 100);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status display properties
  const getStatusDisplay = (statusValue: string) => {
    switch (statusValue) {
      case 'draft':
        return { text: 'Draft', color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
      case 'active':
        return { text: 'Active', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' };
      default:
        return { text: statusValue.charAt(0).toUpperCase() + statusValue.slice(1), color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    }
  };

  const statusDisplay = getStatusDisplay(status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">No image</span>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusDisplay.color}`}>
            {statusDisplay.text}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <Link href={`/projects/${id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{formatCurrency(currentAmount)} raised</span>
            <span className="text-gray-500 dark:text-gray-400">{progress}% of {formatCurrency(goalAmount)}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            By <span className="font-medium text-gray-700 dark:text-gray-300">{creatorName}</span>
          </div>
          <Link 
            href={`/projects/${id}`}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
} 
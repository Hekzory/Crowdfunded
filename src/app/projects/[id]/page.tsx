import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { query } from '@/app/lib/db';
import StartProjectButton from '@/app/components/StartProjectButton';
import { getCurrentUser } from '@/app/lib/auth';
import ContributeFormWrapper from './ContributeFormWrapper';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

async function getProject(id: string) {
  try {
    const result = await query(`
      SELECT 
        p.*,
        u.name as creator_name
      FROM 
        projects p
      JOIN 
        users u ON p.user_id = u.id
      WHERE 
        p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project');
  }
}

// Check if test payment system is enabled
async function isPaymentEnabled() {
  try {
    const result = await query(
      'SELECT value FROM system_settings WHERE key = $1',
      ['test_payment_enabled']
    );
    
    return result.rows.length > 0 && result.rows[0].value === 'true';
  } catch (error) {
    console.error('Error checking payment system:', error);
    return false;
  }
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const project = await getProject(params.id);
  
  if (!project) {
    return {
      title: 'Project Not Found | CrowdFunded',
      description: 'The requested project could not be found.',
    };
  }
  
  return {
    title: `${project.title} | CrowdFunded`,
    description: project.description.substring(0, 160),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Check authentication
  const user = await getCurrentUser();
  
  if (!user) {
    // Redirect to login page if user is not authenticated
    redirect('/login?redirectTo=' + encodeURIComponent(`/projects/${params.id}`));
  }
  
  const project = await getProject(params.id);
  
  if (!project) {
    notFound();
  }
  
  // Check if payment system is enabled
  const paymentEnabled = await isPaymentEnabled();
  
  // Calculate progress percentage
  const progress = Math.min(Math.round((project.current_amount / project.goal_amount) * 100), 100);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format status with display-friendly text and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'draft':
        return { text: 'Draft', color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
      case 'active':
        return { text: 'Active', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' };
      case 'completed':
        return { text: 'Completed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'rejected':
        return { text: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
      default:
        return { text: status.charAt(0).toUpperCase() + status.slice(1), color: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    }
  };

  const statusDisplay = getStatusDisplay(project.status);

  // Check if the current user is the project creator
  const isCreator = user?.userId === project.user_id;

  // Check if the current user can contribute (not creator, project is active)
  const canContribute = !isCreator && project.status === 'active' && paymentEnabled;

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {project.title}
            </h1>
            <span className={`rounded-full px-3 py-1 text-sm font-medium mt-2 lg:mt-0 ${statusDisplay.color}`}>
              {statusDisplay.text}
            </span>
          </div>
          
          <div className="relative rounded-xl overflow-hidden mb-8 aspect-w-16 aspect-h-9">
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-500 dark:text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2>About this project</h2>
            <p className="whitespace-pre-line">{project.description}</p>
          </div>
        </div>
        
        <div className="lg:col-start-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{formatCurrency(project.current_amount)} raised</span>
                <span className="text-gray-500 dark:text-gray-400">{progress}% of {formatCurrency(project.goal_amount)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Creator</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <Link href={`/users/${project.user_id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    {project.creator_name}
                  </Link>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Created</h3>
                <p className="text-gray-600 dark:text-gray-300">{formatDate(project.created_at)}</p>
              </div>
            </div>
            
            {/* Show Start Project button for project creator if project is in draft */}
            {isCreator && project.status === 'draft' && (
              <StartProjectButton projectId={project.id} currentStatus={project.status} />
            )}
            
            {/* Show Contribute Form for active projects if user is not the creator */}
            {canContribute && (
              <div className="mt-6">
                <ContributeFormWrapper 
                  projectId={project.id} 
                  projectTitle={project.title} 
                />
              </div>
            )}
            
            {/* Payment system disabled message */}
            {project.status === 'active' && !paymentEnabled && (
              <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 rounded text-sm">
                The payment system is currently disabled. Please try again later.
              </div>
            )}
            
            {/* Project not accepting contributions message */}
            {project.status !== 'active' && project.status !== 'draft' && (
              <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                This project is not currently accepting contributions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
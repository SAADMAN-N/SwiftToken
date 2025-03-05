'use client';

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({ 
  message = "Failed to generate memecoin", 
  onRetry 
}: ErrorCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-red-200 dark:border-red-900">
      <div className="h-48 w-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <svg 
          className="w-16 h-16 text-red-500 dark:text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Generation Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {message}
          </p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

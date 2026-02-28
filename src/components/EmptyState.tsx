import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">{description}</p>}
    {action && (
      <button
        onClick={action.onClick}
        className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);

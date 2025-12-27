import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}

export const EmptyState = ({ title, description, icon, action, className }: EmptyStateProps) => (
    <div className={cn('flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center text-gray-600', className)}>
        {icon && <div className="mb-4 text-primary">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        {action && <div className="mt-6">{action}</div>}
    </div>
);


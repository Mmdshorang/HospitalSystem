import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
    title?: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export const ErrorState = ({
    title = 'خطایی رخ داد',
    description = 'لطفاً مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید.',
    action,
    className,
}: ErrorStateProps) => (
    <div className={cn('flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/70 px-6 py-10 text-center text-red-600', className)}>
        <AlertTriangle className="mb-4 h-10 w-10 text-red-500" />
        <h3 className="text-lg font-semibold text-red-600">{title}</h3>
        <p className="mt-2 text-sm text-red-500">{description}</p>
        {action && <div className="mt-6">{action}</div>}
    </div>
);


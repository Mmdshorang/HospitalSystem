import { cn } from '@/lib/utils';

interface PageLoaderProps {
    message?: string;
    className?: string;
}

export const PageLoader = ({ message = 'در حال بارگذاری...', className }: PageLoaderProps) => (
    <div className={cn('flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-100 bg-white/70 px-6 py-16 text-center shadow-inner', className)}>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
        <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
);


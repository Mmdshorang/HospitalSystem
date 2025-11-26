import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    prefix?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ className, label, helperText, error, prefix = '+98', ...props }, ref) => {
        return (
            <label className={cn('flex flex-col gap-2 text-right', className)}>
                {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
                <div
                    className={cn(
                        'flex h-14 items-center rounded-2xl border bg-white/80 px-0 text-base shadow-inner transition-all focus-within:border-primary focus-within:shadow-lg',
                        error ? 'border-red-400 ring-1 ring-red-100' : 'border-gray-200'
                    )}
                >
                    <span className="flex items-center justify-center border-l border-gray-100 px-4 text-sm font-semibold text-gray-500">
                        {prefix}
                    </span>
                    <input
                        ref={ref}
                        type="tel"
                        inputMode="tel"
                        className="h-full flex-1 border-0 bg-transparent px-4 text-gray-800 outline-none placeholder:text-gray-400"
                        dir="ltr"
                        {...props}
                    />
                </div>
                {(error || helperText) && (
                    <span className={cn('text-xs', error ? 'text-red-500' : 'text-gray-500')}>
                        {error ?? helperText}
                    </span>
                )}
            </label>
        );
    }
);

PhoneInput.displayName = 'PhoneInput';


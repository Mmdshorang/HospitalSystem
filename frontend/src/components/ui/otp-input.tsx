import * as React from 'react';
import { OTPInput } from 'input-otp';
import { cn } from '@/lib/utils';

export interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
    error?: string;
    label?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    value,
    onChange,
    length = 6,
    disabled,
    error,
    label,
}) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
            <OTPInput
                maxLength={length}
                containerClassName="flex items-center gap-3"
                value={value}
                onChange={onChange}
                inputMode="numeric"
                disabled={disabled}
                render={({ slots }) => (
                    <>
                        {slots.map((slot, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    'relative flex h-12 w-12 items-center justify-center rounded-2xl border bg-white/90 text-xl font-semibold text-gray-700 shadow-sm transition',
                                    slot.isActive && 'border-primary shadow-primary/20',
                                    error ? 'border-red-400 text-red-500' : 'border-gray-200'
                                )}
                            >
                                {slot.char ?? <span className="text-gray-300">•</span>}
                                {slot.hasFakeCaret && (
                                    <span className="pointer-events-none absolute inset-y-2 w-px bg-primary animate-pulse" />
                                )}
                            </div>
                        ))}
                    </>
                )}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};


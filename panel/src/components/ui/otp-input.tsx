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
                containerClassName="flex items-center gap-3 w-full"
                value={value}
                onChange={onChange}
                inputMode="numeric"
                disabled={disabled}
                render={({ slots }) => (
                    <div className="flex w-full gap-3 flex-row-reverse">
                        {slots.map((slot, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    'relative flex h-14 flex-1 items-center justify-center rounded-2xl border bg-white text-2xl font-bold text-gray-800 shadow-sm transition',
                                    slot.isActive && 'border-blue-500 shadow-blue-500/30 ring-2 ring-blue-500/20',
                                    error ? 'border-red-400 text-red-500' : 'border-gray-300'
                                )}
                            >
                                {slot.char ?? <span className="text-gray-300">•</span>}
                                {slot.hasFakeCaret && (
                                    <span className="pointer-events-none absolute inset-y-2 w-px bg-blue-500 animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};


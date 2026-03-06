import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, disabled, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-space-2 w-full">
                {label && <label className="text-sm font-semibold text-secondary">{label}</label>}
                <input
                    ref={ref}
                    disabled={disabled}
                    className={`
            w-full px-space-4 py-space-3 bg-surface-card border border-border-default rounded-md text-primary 
            placeholder:text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus 
            transition-colors duration-200 min-h-[var(--space-8)]
            ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-subtle text-muted' : ''}
            ${error ? 'border-status-error focus:border-status-error focus:ring-status-error' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && <span className="text-xs text-status-error mt-space-1">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';

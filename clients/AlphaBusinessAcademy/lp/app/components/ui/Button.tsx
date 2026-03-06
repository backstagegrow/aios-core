import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'strong';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
        // Base styles using semantic tokens
        const baseStyles = "inline-flex items-center justify-center font-bold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2";

        const variants = {
            primary: "bg-action-primary text-background hover:bg-action-primary-hover active:bg-action-primary-active",
            secondary: "bg-action-secondary text-primary border border-border-default hover:bg-surface-subtle",
            strong: "bg-action-strong text-black hover:bg-action-strong-hover"
        };

        const sizes = {
            sm: "px-space-3 py-space-2 text-sm",
            md: "px-space-4 py-space-3 text-base",
            lg: "px-space-6 py-space-4 text-lg"
        };

        const disabledStyles = disabled ? "opacity-50 cursor-not-allowed bg-surface-subtle text-muted border-none shadow-none" : "";

        return (
            <button
                ref={ref}
                disabled={disabled}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

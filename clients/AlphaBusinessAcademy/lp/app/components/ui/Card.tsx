import React, { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    elevated?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', elevated, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`bg-surface-card rounded-md p-space-6 border border-border-subtle ${elevated ? 'shadow-card hover:shadow-card-hover transition-shadow duration-300' : 'shadow-sm'} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = 'Card';

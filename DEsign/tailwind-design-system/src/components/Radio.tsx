import React from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export function Radio({ label, description, className = '', ...props }: RadioProps) {
  const id = React.useId();
  
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex h-5 items-center">
        <input
          id={id}
          type="radio"
          className="peer sr-only"
          {...props}
        />
        <div className="h-4 w-4 rounded-full border border-zinc-300 bg-white transition-colors peer-focus:ring-2 peer-focus:ring-zinc-900/20 peer-focus:border-zinc-900 peer-checked:border-zinc-900 flex items-center justify-center peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
          <div className="h-2 w-2 rounded-full bg-zinc-900 opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm font-medium text-zinc-900 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          {label}
        </label>
        {description && (
          <p className="text-sm text-zinc-500">{description}</p>
        )}
      </div>
    </div>
  );
}

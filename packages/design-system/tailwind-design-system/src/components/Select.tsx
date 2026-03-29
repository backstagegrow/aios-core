import React from 'react';
import { Icon } from './Icon';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  const id = React.useId();
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`
            w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-zinc-900 
            focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/20 hover:border-zinc-300'
            }
          `}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-zinc-400">
          <Icon name="expand_more" size={20} />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

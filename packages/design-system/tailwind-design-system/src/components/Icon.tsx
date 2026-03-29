import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: 16 | 20 | 24 | 32 | 40;
  className?: string;
}

export function Icon({ name, size = 24, className = '', ...props }: IconProps) {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{ fontSize: size, ...props.style }}
      {...props}
    >
      {name}
    </span>
  );
}

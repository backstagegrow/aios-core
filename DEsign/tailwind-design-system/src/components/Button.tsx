import React from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-md",
    lg: "h-11 px-5 text-base rounded-lg",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-brand text-brand-fg shadow-sm hover:opacity-95 active:opacity-90",
    secondary:
      "bg-surface-2 text-text border border-border hover:bg-surface active:opacity-95",
    outline:
      "bg-transparent text-text border border-border hover:bg-surface-2",
    ghost:
      "bg-transparent text-text hover:bg-surface-2",
  };

  return (
    <button
      {...props}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    />
  );
}

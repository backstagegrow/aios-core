import React, { useState } from 'react';

interface DropdownProps {
    trigger: React.ReactNode;
    items: { label: string; onClick: () => void }[];
}

export function Dropdown({ trigger, items }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-block">
                {trigger}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-space-2 w-56 origin-top-right rounded-md bg-overlay-popover shadow-card ring-1 ring-border-subtle focus:outline-none z-40 animate-in fade-in slide-in-from-top-2" style={{ animationDuration: 'var(--motion-fast)' }}>
                    <div className="py-space-1" role="none">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => { item.onClick(); setIsOpen(false); }}
                                className="text-secondary hover:text-primary hover:bg-surface block w-full text-left px-space-4 py-space-2 text-sm transition-colors"
                                style={{ minHeight: 'var(--space-8)' }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

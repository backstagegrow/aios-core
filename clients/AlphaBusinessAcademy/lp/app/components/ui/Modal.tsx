import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-overlay-backdrop backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-overlay-modal rounded-md shadow-card w-full max-w-lg border border-border-subtle overflow-hidden flex flex-col animate-in fade-in zoom-in-95" style={{ animationDuration: 'var(--motion-normal)' }}>
                {title && (
                    <div className="px-space-6 py-space-4 border-b border-border-subtle flex justify-between items-center">
                        <h3 className="text-lg font-bold text-primary">{title}</h3>
                        <button onClick={onClose} className="text-muted hover:text-primary transition-colors min-h-[var(--space-8)] min-w-[var(--space-8)] flex items-center justify-center">
                            <span className="sr-only">Fechar</span>
                            &times;
                        </button>
                    </div>
                )}
                <div className="p-space-6 text-secondary">
                    {children}
                </div>
            </div>
        </div>
    );
}

"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface PopupContextType {
    isOpen: boolean;
    openPopup: () => void;
    closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    return (
        <PopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
            {children}
        </PopupContext.Provider>
    );
}

export function usePopup() {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
}

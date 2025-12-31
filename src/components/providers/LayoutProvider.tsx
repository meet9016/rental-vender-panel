"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LayoutContextType {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Set initial state based on screen size
        if (window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }
    }, []);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    if (!mounted) {
        return null;
    }

    return (
        <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
}
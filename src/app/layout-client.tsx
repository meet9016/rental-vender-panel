"use client";

import { useLayout } from "@/components/providers/LayoutProvider";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const { sidebarOpen, toggleSidebar } = useLayout();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

            {/* Main content area - sidebar pushes it on desktop, overlays on mobile */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"
                }`}>
                <Header onMenuClick={toggleSidebar} />

                <main className="flex-1 overflow-x-hidden">
                    {/* Remove max-w constraint to use full available width */}
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
"use client";

import { useLayout } from "@/components/providers/LayoutProvider";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const { sidebarOpen, toggleSidebar } = useLayout();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

            {/* Push content when sidebar is open on desktop */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"
                }`}>
                <Header onMenuClick={toggleSidebar} />

                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
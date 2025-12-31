// components/ui/Toast.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, type, message, duration };

        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons = {
        success: <FaCheckCircle className="w-5 h-5" />,
        error: <FaExclamationCircle className="w-5 h-5" />,
        info: <FaInfoCircle className="w-5 h-5" />,
        warning: <FaExclamationCircle className="w-5 h-5" />,
    };

    const styles = {
        success: "bg-green-50 text-green-800 border-green-200",
        error: "bg-red-50 text-red-800 border-red-200",
        info: "bg-blue-50 text-blue-800 border-blue-200",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`${styles[toast.type]} border rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md pointer-events-auto animate-slideInRight`}
                    >
                        <div className="flex-shrink-0">{icons[toast.type]}</div>
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}
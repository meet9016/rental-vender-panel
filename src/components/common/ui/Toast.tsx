// components/ui/Toast.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes, FaSpinner } from "react-icons/fa";

type ToastType = "success" | "error" | "info" | "warning" | "default" | "loading";
type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
type ToastAnimation = "slide" | "fade" | "scale";

interface ToastAction {
    label: string;
    onClick: () => void;
}

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    description?: string;
    duration?: number;
    icon?: ReactNode;
    closable?: boolean;
    action?: ToastAction;
    pauseOnHover?: boolean;
    persist?: boolean;
    onClose?: () => void;
}

interface ToastOptions {
    duration?: number;
    icon?: ReactNode;
    closable?: boolean;
    action?: ToastAction;
    pauseOnHover?: boolean;
    persist?: boolean;
    title?: string;
    description?: string;
    onClose?: () => void;
    id?: string;
}

interface ToastConfig {
    position?: ToastPosition;
    maxToasts?: number;
    animation?: ToastAnimation;
    defaultDuration?: number;
    pauseOnHover?: boolean;
    enableDeduplication?: boolean;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, options?: ToastOptions) => string;
    success: (message: string, options?: ToastOptions) => string;
    error: (message: string, options?: ToastOptions) => string;
    info: (message: string, options?: ToastOptions) => string;
    warning: (message: string, options?: ToastOptions) => string;
    loading: (message: string, options?: ToastOptions) => string;
    dismiss: (id: string) => void;
    clear: () => void;
    update: (id: string, options: Partial<Toast>) => void;
    promise: <T, >(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        },
        options?: ToastOptions
    ) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const defaultConfig: ToastConfig = {
    position: "top-right",
    maxToasts: 5,
    animation: "slide",
    defaultDuration: 3000,
    pauseOnHover: true,
    enableDeduplication: true,
};

export function ToastProvider({
    children,
    config = {}
}: {
    children: ReactNode;
    config?: ToastConfig;
}) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timerRefs = useRef<Record<string, NodeJS.Timeout>>({});
    const mergedConfig = { ...defaultConfig, ...config };

    const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        if (timerRefs.current[id]) {
            clearTimeout(timerRefs.current[id]);
            delete timerRefs.current[id];
        }
    }, []);

    const startTimer = useCallback((toast: Toast) => {
        if (toast.persist || toast.duration === 0) return;

        const duration = toast.duration ?? mergedConfig.defaultDuration ?? 3000;
        timerRefs.current[toast.id] = setTimeout(() => {
            removeToast(toast.id);
            toast.onClose?.();
        }, duration);
    }, [mergedConfig.defaultDuration, removeToast]);

    const pauseTimer = useCallback((id: string) => {
        if (timerRefs.current[id]) {
            clearTimeout(timerRefs.current[id]);
        }
    }, []);

    const resumeTimer = useCallback((toast: Toast) => {
        startTimer(toast);
    }, [startTimer]);

    const showToast = useCallback((
        type: ToastType,
        message: string,
        options: ToastOptions = {}
    ): string => {
        const id = options.id || generateId();

        // Deduplication
        if (mergedConfig.enableDeduplication) {
            const existingToast = toasts.find(t => t.message === message && t.type === type);
            if (existingToast) {
                return existingToast.id;
            }
        }

        const toast: Toast = {
            id,
            type,
            message,
            title: options.title,
            description: options.description,
            duration: options.duration,
            icon: options.icon,
            closable: options.closable ?? true,
            action: options.action,
            pauseOnHover: options.pauseOnHover ?? mergedConfig.pauseOnHover,
            persist: options.persist,
            onClose: options.onClose,
        };

        setToasts((prev) => {
            const newToasts = [...prev, toast];
            // Limit max toasts
            if (mergedConfig.maxToasts && newToasts.length > mergedConfig.maxToasts) {
                const removed = newToasts.shift();
                if (removed) removeToast(removed.id);
            }
            return newToasts;
        });

        startTimer(toast);
        return id;
    }, [toasts, mergedConfig, removeToast, startTimer]);

    const success = useCallback((message: string, options?: ToastOptions) =>
        showToast("success", message, options), [showToast]);

    const error = useCallback((message: string, options?: ToastOptions) =>
        showToast("error", message, options), [showToast]);

    const info = useCallback((message: string, options?: ToastOptions) =>
        showToast("info", message, options), [showToast]);

    const warning = useCallback((message: string, options?: ToastOptions) =>
        showToast("warning", message, options), [showToast]);

    const loading = useCallback((message: string, options?: ToastOptions) =>
        showToast("loading", message, { ...options, persist: true }), [showToast]);

    const dismiss = useCallback((id: string) => {
        const toast = toasts.find(t => t.id === id);
        removeToast(id);
        toast?.onClose?.();
    }, [toasts, removeToast]);

    const clear = useCallback(() => {
        toasts.forEach(toast => toast.onClose?.());
        setToasts([]);
        Object.keys(timerRefs.current).forEach(id => {
            clearTimeout(timerRefs.current[id]);
        });
        timerRefs.current = {};
    }, [toasts]);

    const update = useCallback((id: string, options: Partial<Toast>) => {
        setToasts(prev => prev.map(toast => {
            if (toast.id === id) {
                const updated = { ...toast, ...options };

                // Restart timer if duration changed
                if (options.duration !== undefined || options.type !== undefined) {
                    pauseTimer(id);
                    startTimer(updated);
                }

                return updated;
            }
            return toast;
        }));
    }, [pauseTimer, startTimer]);

    const promise = useCallback(async <T,>(
        promiseFunc: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        },
        options?: ToastOptions
    ): Promise<T> => {
        const id = loading(messages.loading, options);

        try {
            const data = await promiseFunc;
            const successMessage = typeof messages.success === "function"
                ? messages.success(data)
                : messages.success;

            update(id, {
                type: "success",
                message: successMessage,
                persist: false,
                duration: options?.duration ?? mergedConfig.defaultDuration,
            });

            return data;
        } catch (err) {
            const errorMessage = typeof messages.error === "function"
                ? messages.error(err)
                : messages.error;

            update(id, {
                type: "error",
                message: errorMessage,
                persist: false,
                duration: options?.duration ?? mergedConfig.defaultDuration,
            });

            throw err;
        }
    }, [loading, update, mergedConfig.defaultDuration]);

    const defaultIcons: Record<ToastType, ReactNode> = {
        success: <FaCheckCircle className="w-5 h-5" />,
        error: <FaExclamationCircle className="w-5 h-5" />,
        info: <FaInfoCircle className="w-5 h-5" />,
        warning: <FaExclamationTriangle className="w-5 h-5" />,
        default: <FaInfoCircle className="w-5 h-5" />,
        loading: <FaSpinner className="w-5 h-5 animate-spin" />,
    };

    const styles: Record<ToastType, string> = {
        success: "bg-green-50 text-green-800 border-green-200",
        error: "bg-red-50 text-red-800 border-red-200",
        info: "bg-blue-50 text-blue-800 border-blue-200",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
        default: "bg-gray-50 text-gray-800 border-gray-200",
        loading: "bg-blue-50 text-blue-800 border-blue-200",
    };

    const positionClasses: Record<ToastPosition, string> = {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    };

    const animationClasses: Record<ToastAnimation, string> = {
        slide: "animate-slideInRight",
        fade: "animate-fadeIn",
        scale: "animate-scaleIn",
    };

    return (
        <ToastContext.Provider value={{
            showToast,
            success,
            error,
            info,
            warning,
            loading,
            dismiss,
            clear,
            update,
            promise,
        }}>
            {children}
            <div
                className={`fixed ${positionClasses[mergedConfig.position!]} z-[100] space-y-2 pointer-events-none`}
                role="region"
                aria-label="Notifications"
            >
                {toasts.map((toast) => {
                    const toastObj = toasts.find(t => t.id === toast.id);

                    return (
                        <div
                            key={toast.id}
                            className={`${styles[toast.type]} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md pointer-events-auto ${animationClasses[mergedConfig.animation!]} transition-all`}
                            role="alert"
                            aria-live={toast.type === "error" ? "assertive" : "polite"}
                            aria-atomic="true"
                            onMouseEnter={() => toast.pauseOnHover && pauseTimer(toast.id)}
                            onMouseLeave={() => toast.pauseOnHover && toastObj && resumeTimer(toastObj)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {toast.icon || defaultIcons[toast.type]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {toast.title && (
                                        <p className="font-semibold text-sm mb-1">{toast.title}</p>
                                    )}
                                    <p className="text-sm font-medium">{toast.message}</p>
                                    {toast.description && (
                                        <p className="text-xs mt-1 opacity-80">{toast.description}</p>
                                    )}
                                    {toast.action && (
                                        <button
                                            onClick={toast.action.onClick}
                                            className="text-xs font-semibold mt-2 underline hover:no-underline"
                                        >
                                            {toast.action.label}
                                        </button>
                                    )}
                                </div>
                                {toast.closable && (
                                    <button
                                        onClick={() => dismiss(toast.id)}
                                        className="flex-shrink-0 p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
                                        aria-label="Close notification"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
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
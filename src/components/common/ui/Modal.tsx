// components/ui/Modal.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    footer?: ReactNode;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
    closeOnOverlayClick = true,
    footer,
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn"
            onClick={handleOverlayClick}
        >
            <div
                className={`bg-white rounded-lg shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col animate-slideUp`}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-auto"
                                aria-label="Close modal"
                            >
                                <FaTimes className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
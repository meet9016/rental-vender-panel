// components/ui/Modal.tsx
"use client";

import { useEffect, ReactNode, useRef, ComponentProps } from "react";
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";
type ModalVariant = "default" | "danger" | "success";
type ModalAnimation = "fade" | "slide" | "scale";
type ModalPosition = "center" | "top" | "bottom" | "right";
type ModalType = "default" | "confirm";

interface BaseModalProps {
    // 1. BASIC FEATURES
    isOpen?: boolean;
    open?: boolean;
    onClose: () => void;
    title?: string;
    children?: ReactNode;
    showCloseButton?: boolean;

    // 2. SIZE & VARIANTS
    size?: ModalSize;
    variant?: ModalVariant;

    // 3. HEADER, BODY, FOOTER CONTROL
    header?: ReactNode;
    footer?: ReactNode;
    hideHeader?: boolean;
    hideFooter?: boolean;
    divider?: boolean;

    // 4. CLOSE BEHAVIOR CONTROL
    closeOnBackdrop?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEsc?: boolean;
    preventClose?: boolean;
    onBackdropClick?: () => void;

    // 5. SCROLL BEHAVIOR
    scrollable?: boolean;
    lockBodyScroll?: boolean;
    maxHeight?: string;

    // 6. ANIMATIONS & TRANSITIONS
    animation?: ModalAnimation;
    duration?: number;

    // 7. CUSTOM FOOTER ACTIONS
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
    confirmLoading?: boolean;
    confirmVariant?: "primary" | "danger" | "success";

    // 8. CONFIRMATION MODAL MODE
    type?: ModalType;
    dangerConfirm?: boolean;
    icon?: ReactNode;
    description?: string;

    // 9. ASYNC / LOADING STATE
    isLoading?: boolean;

    // 10. POSITIONING OPTIONS
    position?: ModalPosition;
    fullScreenOnMobile?: boolean;

    // 12. ACCESSIBILITY
    ariaLabel?: string;
    ariaDescribedBy?: string;

    // 13. MULTIPLE MODALS / STACKING
    zIndex?: number;
}

type ModalProps = BaseModalProps;

// Subcomponents for composition
const ModalHeader = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
);

const ModalBody = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const ModalFooter = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>{children}</div>
);

export default function Modal({
    isOpen,
    open,
    onClose,
    title,
    children,
    size = "md",
    variant = "default",
    header,
    footer,
    hideHeader = false,
    hideFooter = false,
    divider = true,
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnOverlayClick,
    closeOnEsc = true,
    preventClose = false,
    onBackdropClick,
    scrollable = true,
    lockBodyScroll = true,
    maxHeight,
    animation = "scale",
    duration = 200,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    confirmLoading = false,
    confirmVariant = "primary",
    type = "default",
    dangerConfirm = false,
    icon,
    description,
    isLoading = false,
    position = "center",
    fullScreenOnMobile = false,
    ariaLabel,
    ariaDescribedBy,
    zIndex = 50,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const isModalOpen = open ?? isOpen ?? false;
    const shouldCloseOnBackdrop = closeOnOverlayClick ?? closeOnBackdrop;

    // 5. SCROLL BEHAVIOR - Lock body scroll
    useEffect(() => {
        if (isModalOpen && lockBodyScroll) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen, lockBodyScroll]);

    // 12. ACCESSIBILITY - Focus trap and restore focus
    useEffect(() => {
        if (!isModalOpen) return;

        const modalElement = modalRef.current;
        if (!modalElement) return;

        // Focus first focusable element
        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        firstElement?.focus();

        // Focus trap
        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        modalElement.addEventListener("keydown", handleTab as any);

        return () => {
            modalElement.removeEventListener("keydown", handleTab as any);
            // Restore focus
            previousActiveElement.current?.focus();
        };
    }, [isModalOpen]);

    // 4. CLOSE BEHAVIOR - Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isModalOpen && closeOnEsc && !preventClose && !isLoading) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isModalOpen, onClose, closeOnEsc, preventClose, isLoading]);

    if (!isModalOpen) return null;

    // 2. SIZE & VARIANTS
    const sizes: Record<ModalSize, string> = {
        xs: "max-w-xs",
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-full mx-4",
    };

    const variantStyles: Record<ModalVariant, string> = {
        default: "border-t-4 border-t-blue-500",
        danger: "border-t-4 border-t-red-500",
        success: "border-t-4 border-t-green-500",
    };

    // 6. ANIMATIONS
    const animations: Record<ModalAnimation, string> = {
        fade: "animate-fadeIn",
        slide: "animate-slideUp",
        scale: "animate-scaleIn",
    };

    // 10. POSITIONING
    const positions: Record<ModalPosition, string> = {
        center: "items-center justify-center",
        top: "items-start justify-center pt-20",
        bottom: "items-end justify-center pb-20",
        right: "items-center justify-end",
    };

    const positionModalStyles: Record<ModalPosition, string> = {
        center: "",
        top: "",
        bottom: "",
        right: "h-full max-h-full rounded-l-lg rounded-r-none",
    };

    // 4. CLOSE BEHAVIOR - Handle backdrop click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (preventClose || isLoading) return;

        if (e.target === e.currentTarget) {
            onBackdropClick?.();
            if (shouldCloseOnBackdrop) {
                onClose();
            }
        }
    };

    // 4. CLOSE BEHAVIOR - Handle close button
    const handleClose = () => {
        if (preventClose || isLoading) return;
        onClose();
    };

    // 7. CUSTOM FOOTER ACTIONS - Handle confirm
    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm();
        }
    };

    // 8. CONFIRMATION MODAL - Icon mapping
    const getConfirmIcon = () => {
        if (icon) return icon;
        if (dangerConfirm || variant === "danger") return <FaExclamationTriangle className="w-12 h-12 text-red-500" />;
        if (variant === "success") return <FaCheckCircle className="w-12 h-12 text-green-500" />;
        return <FaInfoCircle className="w-12 h-12 text-blue-500" />;
    };

    // 7. CUSTOM FOOTER ACTIONS - Button variants
    const confirmButtonStyles: Record<string, string> = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        success: "bg-green-600 hover:bg-green-700 text-white",
    };

    const actualConfirmVariant = dangerConfirm ? "danger" : confirmVariant;

    // Default footer with actions
    const defaultFooter = (onConfirm || confirmText || cancelText) && (
        <div className="flex gap-3 justify-end">
            <button
                onClick={handleClose}
                disabled={confirmLoading || isLoading}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {cancelText}
            </button>
            <button
                onClick={handleConfirm}
                disabled={confirmLoading || isLoading}
                className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${confirmButtonStyles[actualConfirmVariant]
                    }`}
            >
                {(confirmLoading || isLoading) && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {confirmText}
            </button>
        </div>
    );

    // 8. CONFIRMATION MODAL - Render confirmation type
    if (type === "confirm") {
        return (
            <div
                className={`fixed inset-0 flex p-4 bg-black bg-opacity-50 ${positions[position]} ${animations[animation]}`}
                onClick={handleOverlayClick}
                style={{ zIndex }}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel || title}
                aria-describedby={ariaDescribedBy}
            >
                <div
                    ref={modalRef}
                    className={`bg-white rounded-lg shadow-2xl w-full ${sizes[size]} ${fullScreenOnMobile ? "sm:max-w-lg max-h-full sm:max-h-[90vh]" : "max-h-[90vh]"
                        } flex flex-col ${variantStyles[variant]}`}
                    style={{ animationDuration: `${duration}ms` }}
                >
                    <div className="px-6 py-8 text-center">
                        <div className="flex justify-center mb-4">{getConfirmIcon()}</div>
                        {title && <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>}
                        {description && <p className="text-gray-600 mb-6">{description}</p>}
                        {children}
                    </div>
                    {!hideFooter && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            {footer || defaultFooter}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default modal render
    return (
        <div
            className={`fixed inset-0 flex p-4 bg-black bg-opacity-50 ${positions[position]} ${animations[animation]}`}
            onClick={handleOverlayClick}
            style={{ zIndex }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            aria-describedby={ariaDescribedBy}
        >
            <div
                ref={modalRef}
                className={`bg-white rounded-lg shadow-2xl w-full ${sizes[size]} ${positionModalStyles[position]} ${fullScreenOnMobile ? "h-full sm:h-auto sm:max-h-[90vh]" : "max-h-[90vh]"
                    } flex flex-col ${variantStyles[variant]}`}
                style={{ animationDuration: `${duration}ms` }}
            >
                {/* 9. LOADING OVERLAY */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                )}

                {/* Header */}
                {!hideHeader && (title || showCloseButton || header) && (
                    <div className={`flex items-center justify-between px-6 py-4 ${divider ? "border-b border-gray-200" : ""}`}>
                        {header || (
                            <>
                                {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
                                {showCloseButton && (
                                    <button
                                        onClick={handleClose}
                                        disabled={preventClose || isLoading}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Close modal"
                                    >
                                        <FaTimes className="w-5 h-5 text-gray-600" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Body */}
                <div
                    className={`px-6 py-4 flex-1 ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}
                    style={maxHeight ? { maxHeight } : undefined}
                >
                    {children}
                </div>

                {/* Footer */}
                {!hideFooter && (footer || onConfirm || confirmText) && (
                    <div className={`px-6 py-4 bg-gray-50 rounded-b-lg ${divider ? "border-t border-gray-200" : ""}`}>
                        {footer || defaultFooter}
                    </div>
                )}
            </div>
        </div>
    );
}

// 11. COMPOSITION SUPPORT
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
// components/ui/Badge.tsx
"use client";

import { ReactNode, useState } from "react";

type BadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "neutral";
type BadgeSize = "xs" | "sm" | "md" | "lg";
type BadgeAppearance = "solid" | "outline" | "soft";
type BadgeShape = "rounded" | "pill" | "square";
type DotPosition = "left" | "right";

interface CommonBadgeProps {
    // Content
    children?: ReactNode;
    label?: string;

    // Styling
    variant?: BadgeVariant;
    size?: BadgeSize;
    appearance?: BadgeAppearance;
    shape?: BadgeShape;

    // Icons
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;

    // Dot/Status
    dot?: boolean;
    dotPosition?: DotPosition;

    // Count Badge
    count?: number;
    maxCount?: number;

    // Interactive
    closable?: boolean;
    onClose?: () => void;
    onClick?: () => void;
    disabled?: boolean;

    // Tooltip
    tooltip?: string;

    // Accessibility
    ariaLabel?: string;

    // Custom
    className?: string;
}

export function Badge({
    children,
    label,
    variant = "primary",
    size = "md",
    appearance = "soft",
    shape = "rounded",
    leftIcon,
    rightIcon,
    dot = false,
    dotPosition = "left",
    count,
    maxCount = 99,
    closable = false,
    onClose,
    onClick,
    disabled = false,
    tooltip,
    ariaLabel,
    className = "",
}: CommonBadgeProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Handle close
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        onClose?.();
    };

    // Don't render if closed
    if (!isVisible) return null;

    // Variant styles
    const variantStyles = {
        solid: {
            primary: "bg-blue-600 text-white",
            secondary: "bg-gray-600 text-white",
            success: "bg-green-600 text-white",
            danger: "bg-red-600 text-white",
            warning: "bg-yellow-500 text-white",
            info: "bg-cyan-600 text-white",
            neutral: "bg-gray-500 text-white",
        },
        outline: {
            primary: "bg-transparent border-2 border-blue-600 text-blue-700",
            secondary: "bg-transparent border-2 border-gray-600 text-gray-700",
            success: "bg-transparent border-2 border-green-600 text-green-700",
            danger: "bg-transparent border-2 border-red-600 text-red-700",
            warning: "bg-transparent border-2 border-yellow-500 text-yellow-700",
            info: "bg-transparent border-2 border-cyan-600 text-cyan-700",
            neutral: "bg-transparent border-2 border-gray-500 text-gray-700",
        },
        soft: {
            primary: "bg-blue-100 text-blue-800",
            secondary: "bg-gray-100 text-gray-800",
            success: "bg-green-100 text-green-800",
            danger: "bg-red-100 text-red-800",
            warning: "bg-yellow-100 text-yellow-800",
            info: "bg-cyan-100 text-cyan-800",
            neutral: "bg-gray-100 text-gray-700",
        },
    };

    // Size styles
    const sizeStyles = {
        xs: "px-1.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
    };

    // Icon size based on badge size
    const iconSizeStyles = {
        xs: "w-2.5 h-2.5",
        sm: "w-3 h-3",
        md: "w-3.5 h-3.5",
        lg: "w-4 h-4",
    };

    // Shape styles
    const shapeStyles = {
        rounded: "rounded",
        pill: "rounded-full",
        square: "rounded-none",
    };

    // Dot styles
    const dotStyles = {
        primary: "bg-blue-600",
        secondary: "bg-gray-600",
        success: "bg-green-600",
        danger: "bg-red-600",
        warning: "bg-yellow-500",
        info: "bg-cyan-600",
        neutral: "bg-gray-500",
    };

    const dotSizeStyles = {
        xs: "w-1.5 h-1.5",
        sm: "w-2 h-2",
        md: "w-2 h-2",
        lg: "w-2.5 h-2.5",
    };

    // Interactive styles
    const interactiveClass = onClick && !disabled
        ? "cursor-pointer hover:opacity-80 transition-opacity"
        : "";

    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

    // Display count or children
    const displayContent = count !== undefined
        ? count > maxCount ? `${maxCount}+` : count
        : (label || children);

    return (
        <span
            className={`inline-flex items-center font-medium gap-1 ${variantStyles[appearance][variant]} ${sizeStyles[size]} ${shapeStyles[shape]} ${interactiveClass} ${disabledClass} ${className}`}
            onClick={onClick && !disabled ? onClick : undefined}
            title={tooltip}
            aria-label={ariaLabel || (typeof displayContent === 'string' ? displayContent : undefined)}
            role={onClick ? "button" : undefined}
            tabIndex={onClick && !disabled ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {/* Left Dot */}
            {dot && dotPosition === "left" && (
                <span className={`${dotStyles[variant]} ${dotSizeStyles[size]} rounded-full`} />
            )}

            {/* Left Icon */}
            {leftIcon && (
                <span className={`inline-flex items-center ${iconSizeStyles[size]}`}>
                    {leftIcon}
                </span>
            )}

            {/* Content */}
            {displayContent}

            {/* Right Icon */}
            {rightIcon && (
                <span className={`inline-flex items-center ${iconSizeStyles[size]}`}>
                    {rightIcon}
                </span>
            )}

            {/* Right Dot */}
            {dot && dotPosition === "right" && (
                <span className={`${dotStyles[variant]} ${dotSizeStyles[size]} rounded-full`} />
            )}

            {/* Close Button */}
            {closable && (
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={disabled}
                    className={`ml-1 inline-flex items-center hover:opacity-70 focus:outline-none ${iconSizeStyles[size]}`}
                    aria-label="Close"
                >
                    <svg
                        className="w-full h-full"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </span>
    );
}

// Card component (unchanged, just added for completeness)
interface CardProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    footer?: ReactNode;
    hoverable?: boolean;
    bordered?: boolean;
    shadow?: "none" | "sm" | "md" | "lg";
    className?: string;
}

export function Card({
    children,
    title,
    subtitle,
    footer,
    hoverable = false,
    bordered = true,
    shadow = "md",
    className = "",
}: CardProps) {
    const shadows = {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
    };

    const borderClass = bordered ? "border border-gray-200" : "";
    const hoverClass = hoverable
        ? "hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        : "";

    return (
        <div
            className={`bg-white rounded-lg ${borderClass} ${shadows[shadow]} ${hoverClass} ${className}`}
        >
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                </div>
            )}

            <div className="px-6 py-4">{children}</div>

            {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    {footer}
                </div>
            )}
        </div>
    );
}
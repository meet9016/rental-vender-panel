// components/ui/Badge.tsx
import { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
    size?: "sm" | "md" | "lg";
    rounded?: boolean;
    className?: string;
}

export function Badge({
    children,
    variant = "primary",
    size = "md",
    rounded = false,
    className = "",
}: BadgeProps) {
    const variants = {
        primary: "bg-blue-100 text-blue-800",
        secondary: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        danger: "bg-red-100 text-red-800",
        warning: "bg-yellow-100 text-yellow-800",
        info: "bg-cyan-100 text-cyan-800",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
    };

    const roundedClass = rounded ? "rounded-full" : "rounded";

    return (
        <span
            className={`inline-flex items-center font-medium ${variants[variant]} ${sizes[size]} ${roundedClass} ${className}`}
        >
            {children}
        </span>
    );
}

// components/ui/Card.tsx
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
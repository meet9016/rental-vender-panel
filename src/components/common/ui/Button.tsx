// components/ui/CommonButton.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";

interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    // Variants
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";

    // Size
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    fullWidth?: boolean;

    // Loading State
    isLoading?: boolean;
    loadingText?: string;

    // Icon Support
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    // Accessibility
    ariaLabel?: string;

    // Custom Styling
    fontSize?: number;
    fontWeight?: number | string;
    pxClass?: string;
    pyClass?: string;
}

const Button = forwardRef<HTMLButtonElement, CommonButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            fullWidth = false,
            isLoading = false,
            loadingText,
            leftIcon,
            rightIcon,
            ariaLabel,
            fontSize,
            fontWeight,
            disabled,
            className = "",
            pxClass,
            pyClass,
            type = "button",
            ...props
        },
        ref
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary:
                "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
            secondary:
                "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800",
            danger:
                "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
            outline:
                "bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
            ghost:
                "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        };

        const sizes = {
            xs: "text-xs",
            sm: "text-sm",
            md: "text-sm",
            lg: "text-base",
            xl: "text-lg",
        };

        // Default padding per size (can be overridden)
        const defaultPadding = {
            xs: pxClass || "px-2",
            sm: pxClass || "px-3",
            md: pxClass || "px-4",
            lg: pxClass || "px-6",
            xl: pxClass || "px-8",
        };

        const defaultPaddingY = {
            xs: pyClass || "py-1",
            sm: pyClass || "py-1.5",
            md: pyClass || "py-2",
            lg: pyClass || "py-3",
            xl: pyClass || "py-4",
        };

        const widthClass = fullWidth ? "w-full" : "";
        const customFontSize = fontSize ? { fontSize: `${fontSize}px` } : {};
        const customFontWeight = fontWeight ? { fontWeight } : {};

        const isDisabled = disabled || isLoading;
        const displayText = isLoading && loadingText ? loadingText : children;

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                aria-label={ariaLabel}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${defaultPadding[size]} ${defaultPaddingY[size]} ${widthClass} ${className}`}
                style={{ ...customFontSize, ...customFontWeight }}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}

                {!isLoading && leftIcon && (
                    <span className="mr-2 inline-flex items-center">{leftIcon}</span>
                )}

                {displayText}

                {!isLoading && rightIcon && (
                    <span className="ml-2 inline-flex items-center">{rightIcon}</span>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
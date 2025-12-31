// components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            icon,
            iconPosition = "left",
            className = "",
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        const baseStyles =
            "w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white";

        const errorStyles = error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

        const iconPadding = icon
            ? iconPosition === "left"
                ? "pl-10"
                : "pr-10"
            : "";

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && iconPosition === "left" && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {icon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={`${baseStyles} ${errorStyles} ${iconPadding} ${className}`}
                        {...props}
                    />

                    {icon && iconPosition === "right" && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {icon}
                        </div>
                    )}
                </div>

                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
// components/ui/Checkbox.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, id, className = "", ...props }, ref) => {
        const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={checkboxId}
                        className={`w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                        {...props}
                    />
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                        >
                            {label}
                        </label>
                    )}
                </div>
                {error && <p className="text-sm text-red-600 ml-6">{error}</p>}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

// components/ui/Radio.tsx
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ label, error, id, className = "", ...props }, ref) => {
        const radioId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <input
                        ref={ref}
                        type="radio"
                        id={radioId}
                        className={`w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
                        {...props}
                    />
                    {label && (
                        <label
                            htmlFor={radioId}
                            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                        >
                            {label}
                        </label>
                    )}
                </div>
                {error && <p className="text-sm text-red-600 ml-6">{error}</p>}
            </div>
        );
    }
);

Radio.displayName = "Radio";

// components/ui/RadioGroup.tsx
interface RadioGroupOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface RadioGroupProps {
    name: string;
    options: RadioGroupOption[];
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    direction?: "horizontal" | "vertical";
}

export function RadioGroup({
    name,
    options,
    value,
    onChange,
    label,
    error,
    direction = "vertical",
}: RadioGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">{label}</label>
            )}
            <div
                className={`flex gap-4 ${direction === "vertical" ? "flex-col" : "flex-row flex-wrap"
                    }`}
            >
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        name={name}
                        label={option.label}
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                        disabled={option.disabled}
                    />
                ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
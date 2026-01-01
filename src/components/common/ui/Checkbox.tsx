// components/ui/Checkbox.tsx
"use client";

import { InputHTMLAttributes, forwardRef, useEffect, useRef, ReactNode } from "react";

type CheckboxSize = "sm" | "md" | "lg";
type CheckboxVariant = "default" | "primary" | "danger";
type LabelPosition = "left" | "right";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
    label?: string;
    size?: CheckboxSize;
    variant?: CheckboxVariant;
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
    indeterminate?: boolean;
    checkedIcon?: ReactNode;
    uncheckedIcon?: ReactNode;
    indeterminateIcon?: ReactNode;
    labelPosition?: LabelPosition;
    ariaLabel?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            label,
            size = "md",
            variant = "default",
            error = false,
            errorMessage,
            helperText,
            indeterminate = false,
            checkedIcon,
            uncheckedIcon,
            indeterminateIcon,
            labelPosition = "right",
            ariaLabel,
            id,
            className = "",
            ...props
        },
        ref
    ) => {
        const checkboxRef = useRef<HTMLInputElement>(null);
        const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

        // Handle indeterminate state
        useEffect(() => {
            if (checkboxRef.current) {
                checkboxRef.current.indeterminate = indeterminate;
            }
        }, [indeterminate]);

        // Size styles
        const sizeStyles = {
            sm: "w-3.5 h-3.5",
            md: "w-4 h-4",
            lg: "w-5 h-5",
        };

        const labelSizeStyles = {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        };

        // Variant styles
        const variantStyles = {
            default: error
                ? "text-red-600 focus:ring-red-500 border-red-300"
                : "text-blue-600 focus:ring-blue-500 border-gray-300",
            primary: "text-blue-600 focus:ring-blue-500 border-gray-300",
            danger: "text-red-600 focus:ring-red-500 border-gray-300",
        };

        const labelContent = label && (
            <label
                htmlFor={checkboxId}
                className={`font-medium text-gray-700 cursor-pointer select-none ${labelSizeStyles[size]}`}
            >
                {label}
            </label>
        );

        return (
            <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 ${labelPosition === "left" ? "flex-row-reverse justify-end" : ""}`}>
                    <input
                        ref={(node) => {
                            checkboxRef.current = node;
                            if (typeof ref === "function") {
                                ref(node);
                            } else if (ref) {
                                ref.current = node;
                            }
                        }}
                        type="checkbox"
                        id={checkboxId}
                        aria-label={ariaLabel}
                        aria-checked={indeterminate ? "mixed" : props.checked}
                        className={`bg-white rounded focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
                        {...props}
                    />
                    {labelContent}
                </div>
                {error && errorMessage && (
                    <p className="text-sm text-red-600 ml-6">{errorMessage}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-gray-500 ml-6">{helperText}</p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

// components/ui/CheckboxGroup.tsx
interface CheckboxGroupOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface CheckboxGroupProps {
    name: string;
    label?: string;
    options: CheckboxGroupOption[];
    value?: string[];
    defaultValue?: string[];
    onChange: (value: string[]) => void;
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
    direction?: "horizontal" | "vertical";
    size?: CheckboxSize;
    variant?: CheckboxVariant;
    disabled?: boolean;
}

export function CheckboxGroup({
    name,
    label,
    options,
    value = [],
    defaultValue = [],
    onChange,
    error = false,
    errorMessage,
    helperText,
    direction = "vertical",
    size = "md",
    variant = "default",
    disabled = false,
}: CheckboxGroupProps) {
    const handleChange = (optionValue: string, checked: boolean) => {
        if (checked) {
            onChange([...value, optionValue]);
        } else {
            onChange(value.filter((v) => v !== optionValue));
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">{label}</label>
            )}
            <div
                className={`flex gap-4 ${direction === "vertical" ? "flex-col" : "flex-row flex-wrap"}`}
                role="group"
                aria-label={label}
            >
                {options.map((option) => (
                    <Checkbox
                        key={option.value}
                        name={name}
                        label={option.label}
                        value={option.value}
                        checked={value.includes(option.value)}
                        onChange={(e) => handleChange(option.value, e.target.checked)}
                        disabled={disabled || option.disabled}
                        size={size}
                        variant={variant}
                    />
                ))}
            </div>
            {error && errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}

// components/ui/CommonRadio.tsx
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
    label?: string;
    size?: CheckboxSize;
    variant?: CheckboxVariant;
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
    labelPosition?: LabelPosition;
    ariaLabel?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    (
        {
            label,
            size = "md",
            variant = "default",
            error = false,
            errorMessage,
            helperText,
            labelPosition = "right",
            ariaLabel,
            id,
            className = "",
            ...props
        },
        ref
    ) => {
        const radioId = id || label?.toLowerCase().replace(/\s+/g, "-");

        // Size styles
        const sizeStyles = {
            sm: "w-3.5 h-3.5",
            md: "w-4 h-4",
            lg: "w-5 h-5",
        };

        const labelSizeStyles = {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        };

        // Variant styles
        const variantStyles = {
            default: error
                ? "text-red-600 focus:ring-red-500 border-red-300"
                : "text-blue-600 focus:ring-blue-500 border-gray-300",
            primary: "text-blue-600 focus:ring-blue-500 border-gray-300",
            danger: "text-red-600 focus:ring-red-500 border-gray-300",
        };

        const labelContent = label && (
            <label
                htmlFor={radioId}
                className={`font-medium text-gray-700 cursor-pointer select-none ${labelSizeStyles[size]}`}
            >
                {label}
            </label>
        );

        return (
            <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 ${labelPosition === "left" ? "flex-row-reverse justify-end" : ""}`}>
                    <input
                        ref={ref}
                        type="radio"
                        id={radioId}
                        aria-label={ariaLabel}
                        className={`bg-white focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
                        {...props}
                    />
                    {labelContent}
                </div>
                {error && errorMessage && (
                    <p className="text-sm text-red-600 ml-6">{errorMessage}</p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-gray-500 ml-6">{helperText}</p>
                )}
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
    description?: string;
}

interface RadioGroupProps {
    name: string;
    label?: string;
    options: RadioGroupOption[];
    value?: string;
    defaultValue?: string;
    onChange: (value: string) => void;
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
    direction?: "horizontal" | "vertical";
    size?: CheckboxSize;
    variant?: CheckboxVariant;
    disabled?: boolean;
    renderOption?: (option: RadioGroupOption) => ReactNode;
    labelPosition?: LabelPosition;
}

export function RadioGroup({
    name,
    label,
    options,
    value,
    defaultValue,
    onChange,
    error = false,
    errorMessage,
    helperText,
    direction = "vertical",
    size = "md",
    variant = "default",
    disabled = false,
    renderOption,
    labelPosition = "right",
}: RadioGroupProps) {
    const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
        let nextIndex = currentIndex;

        switch (e.key) {
            case "ArrowDown":
            case "ArrowRight":
                e.preventDefault();
                nextIndex = (currentIndex + 1) % options.length;
                // Skip disabled options
                while (options[nextIndex]?.disabled && nextIndex !== currentIndex) {
                    nextIndex = (nextIndex + 1) % options.length;
                }
                if (!options[nextIndex]?.disabled) {
                    onChange(options[nextIndex].value);
                }
                break;
            case "ArrowUp":
            case "ArrowLeft":
                e.preventDefault();
                nextIndex = currentIndex - 1 < 0 ? options.length - 1 : currentIndex - 1;
                // Skip disabled options
                while (options[nextIndex]?.disabled && nextIndex !== currentIndex) {
                    nextIndex = nextIndex - 1 < 0 ? options.length - 1 : nextIndex - 1;
                }
                if (!options[nextIndex]?.disabled) {
                    onChange(options[nextIndex].value);
                }
                break;
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">{label}</label>
            )}
            <div
                className={`flex gap-4 ${direction === "vertical" ? "flex-col" : "flex-row flex-wrap"}`}
                role="radiogroup"
                aria-label={label}
            >
                {options.map((option, index) => (
                    <div key={option.value} onKeyDown={(e) => handleKeyDown(e, index)}>
                        {renderOption ? (
                            <div
                                onClick={() => !disabled && !option.disabled && onChange(option.value)}
                                className={`cursor-pointer ${disabled || option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {renderOption(option)}
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <Radio
                                    name={name}
                                    label={option.label}
                                    value={option.value}
                                    checked={value === option.value}
                                    onChange={() => onChange(option.value)}
                                    disabled={disabled || option.disabled}
                                    size={size}
                                    variant={variant}
                                    labelPosition={labelPosition}
                                />
                                {option.description && (
                                    <p className="text-xs text-gray-500 ml-6 mt-1">{option.description}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {error && errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}
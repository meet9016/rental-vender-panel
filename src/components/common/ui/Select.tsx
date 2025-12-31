// components/ui/Select.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    options: SelectOption[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    className?: string;
}

export default function Select({
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    error,
    helperText,
    disabled = false,
    className = "",
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const baseStyles =
        "w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white cursor-pointer";

    const errorStyles = error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    const disabledStyles = disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:border-gray-400";

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div className="relative" ref={selectRef}>
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`${baseStyles} ${errorStyles} ${disabledStyles} flex items-center justify-between`}
                    disabled={disabled}
                >
                    <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <FaChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center justify-between ${value === option.value ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                    }`}
                            >
                                <span>{option.label}</span>
                                {value === option.value && <FaCheck className="w-4 h-4" />}
                            </button>
                        ))}
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
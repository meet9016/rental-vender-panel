// components/ui/Select.tsx
"use client";

import { useState, useRef, useEffect, ReactNode, useMemo } from "react";
import { FaChevronDown, FaCheck, FaTimes, FaSearch } from "react-icons/fa";

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    icon?: ReactNode;
    group?: string;
}

export interface SelectGroupOption {
    label: string;
    options: SelectOption[];
}

type SelectVariant = "default" | "error" | "success";
type SelectSize = "sm" | "md" | "lg";
type DropdownPosition = "top" | "bottom" | "auto";

interface CommonSelectProps {
    // Basic
    label?: string;
    options: SelectOption[] | SelectGroupOption[];
    value?: string | string[];
    onChange: (value: string | string[]) => void;
    placeholder?: string;
    name?: string;
    id?: string;
    required?: boolean;

    // Styling
    variant?: SelectVariant;
    size?: SelectSize;
    fullWidth?: boolean;
    className?: string;

    // States
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    helperText?: string;

    // Multi-select
    multiple?: boolean;
    maxSelection?: number;

    // Searchable
    searchable?: boolean;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    noOptionsText?: string;

    // Async/Loading
    isLoading?: boolean;
    loadOptions?: (search: string) => Promise<SelectOption[]>;

    // Clearable
    clearable?: boolean;

    // Behavior
    openOnFocus?: boolean;
    closeOnSelect?: boolean;
    maxMenuHeight?: number;
    dropdownPosition?: DropdownPosition;

    // Custom Rendering
    renderOption?: (option: SelectOption) => ReactNode;

    // Accessibility
    ariaLabel?: string;
}

export default function Select({
    label,
    options = [],
    value,
    onChange,
    placeholder = "Select an option",
    name,
    id,
    required = false,
    variant = "default",
    size = "md",
    fullWidth = true,
    className = "",
    disabled = false,
    error = false,
    errorMessage,
    helperText,
    multiple = false,
    maxSelection,
    searchable = false,
    searchPlaceholder = "Search...",
    onSearch,
    noOptionsText = "No options found",
    isLoading = false,
    loadOptions,
    clearable = false,
    openOnFocus = false,
    closeOnSelect = true,
    maxMenuHeight = 300,
    dropdownPosition = "auto",
    renderOption,
    ariaLabel,
}: CommonSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const selectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    // Normalize options (handle grouped options)
    const normalizedOptions = useMemo<SelectOption[]>(() => {
        if (!Array.isArray(options) || options.length === 0) return [];

        return "options" in options[0]
            ? (options as SelectGroupOption[]).flatMap(g => g.options)
            : (options as SelectOption[]);
    }, [options]);

    // Get selected values as array
    const selectedValues = multiple
        ? (Array.isArray(value) ? value : value ? [value] : [])
        : (value ? [value] : []);

    // Get selected options
    const selectedOptions = normalizedOptions.filter(opt =>
        selectedValues.includes(opt.value)
    );

    // Filter options based on search
    useEffect(() => {
        if (searchable || loadOptions) {
            let filtered = normalizedOptions;

            if (searchQuery) {
                filtered = filtered.filter(opt =>
                    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setFilteredOptions(filtered);   // 🔁 causes re-render
            setHighlightedIndex(0);

            if (onSearch) {
                onSearch(searchQuery);
            }
        } else {
            setFilteredOptions(normalizedOptions); // 🔁 causes re-render
        }
    }, [searchQuery, normalizedOptions, searchable, loadOptions, onSearch]);


    // Handle async loading
    useEffect(() => {
        if (loadOptions && searchQuery) {
            const loadAsync = async () => {
                const results = await loadOptions(searchQuery);
                setFilteredOptions(results);
            };
            loadAsync();
        }
    }, [searchQuery, loadOptions]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    // Handle selection
    const handleSelect = (optionValue: string) => {
        if (multiple) {
            const newValues = selectedValues.includes(optionValue)
                ? selectedValues.filter(v => v !== optionValue)
                : maxSelection && selectedValues.length >= maxSelection
                    ? selectedValues
                    : [...selectedValues, optionValue];

            onChange(newValues);

            if (!closeOnSelect) {
                return;
            }
        } else {
            onChange(optionValue);
        }

        if (closeOnSelect) {
            setIsOpen(false);
            setSearchQuery("");
        }
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(multiple ? [] : "");
    };

    // Remove single value in multi-select
    const handleRemoveValue = (valueToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (multiple) {
            onChange(selectedValues.filter(v => v !== valueToRemove));
        }
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setHighlightedIndex(prev =>
                        prev < filteredOptions.length - 1 ? prev + 1 : prev
                    );
                }
                break;
            case "ArrowUp":
                e.preventDefault();
                if (isOpen) {
                    setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
                }
                break;
            case "Enter":
                e.preventDefault();
                if (isOpen && filteredOptions[highlightedIndex]) {
                    handleSelect(filteredOptions[highlightedIndex].value);
                } else {
                    setIsOpen(true);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setSearchQuery("");
                break;
            case "Tab":
                if (isOpen) {
                    setIsOpen(false);
                }
                break;
        }
    };

    // Variant styles
    const variantStyles = {
        default: error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500",
        success: "border-green-500 focus:border-green-500 focus:ring-green-500",
    };

    // Size styles
    const sizeStyles = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-4 py-3 text-base",
    };

    const baseStyles =
        "w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white cursor-pointer";

    const disabledStyles = disabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:border-gray-400";

    const widthClass = fullWidth ? "w-full" : "";

    // Render display value
    const renderDisplayValue = () => {
        if (multiple && selectedOptions.length > 0) {
            if (selectedOptions.length <= 2) {
                return (
                    <div className="flex flex-wrap gap-1">
                        {selectedOptions.map(opt => (
                            <span
                                key={opt.value}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                                {opt.label}
                                <button
                                    type="button"
                                    onClick={(e) => handleRemoveValue(opt.value, e)}
                                    className="hover:text-blue-900"
                                >
                                    <FaTimes className="w-2.5 h-2.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                            {selectedOptions[0].label}
                            <button
                                type="button"
                                onClick={(e) => handleRemoveValue(selectedOptions[0].value, e)}
                                className="hover:text-blue-900"
                            >
                                <FaTimes className="w-2.5 h-2.5" />
                            </button>
                        </span>
                        <span className="text-gray-500 text-xs">
                            +{selectedOptions.length - 1} more
                        </span>
                    </div>
                );
            }
        }

        if (!multiple && selectedOptions[0]) {
            return (
                <span className="text-gray-900">{selectedOptions[0].label}</span>
            );
        }

        return <span className="text-gray-500">{placeholder}</span>;
    };

    return (
        <div className={`${widthClass} ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative" ref={selectRef}>
                <button
                    type="button"
                    id={selectId}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    onFocus={() => openOnFocus && !disabled && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} flex items-center justify-between gap-2`}
                    disabled={disabled}
                    aria-label={ariaLabel}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    role="combobox"
                >
                    <div className="flex-1 text-left overflow-hidden">
                        {renderDisplayValue()}
                    </div>

                    <div className="flex items-center gap-2">
                        {clearable && selectedValues.length > 0 && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        )}
                        <FaChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>
                </button>

                {isOpen && (
                    <div
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
                        style={{ maxHeight: maxMenuHeight }}
                        role="listbox"
                    >
                        {/* Search Input */}
                        {searchable && (
                            <div className="p-2 border-b border-gray-200">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options List */}
                        <div className="overflow-y-auto" style={{ maxHeight: maxMenuHeight - 60 }}>
                            {isLoading ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    <div className="animate-spin mx-auto w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                                    <p className="mt-2 text-sm">Loading...</p>
                                </div>
                            ) : filteredOptions.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                    {noOptionsText}
                                </div>
                            ) : (
                                filteredOptions.map((option, index) => {
                                    const isSelected = selectedValues.includes(option.value);
                                    const isHighlighted = index === highlightedIndex;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => !option.disabled && handleSelect(option.value)}
                                            disabled={option.disabled}
                                            className={`w-full px-4 py-2 text-left transition-colors flex items-center justify-between ${option.disabled
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-100"
                                                } ${isSelected ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                                } ${isHighlighted ? "bg-gray-50" : ""}`}
                                            role="option"
                                            aria-selected={isSelected}
                                        >
                                            <span className="flex items-center gap-2">
                                                {option.icon && <span>{option.icon}</span>}
                                                {renderOption ? renderOption(option) : option.label}
                                            </span>
                                            {isSelected && (
                                                <FaCheck className="w-4 h-4 flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {(error || variant === "error") && errorMessage && (
                <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
            )}

            {/* Helper Text */}
            {helperText && !error && variant !== "error" && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}
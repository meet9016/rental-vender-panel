"use client"
import React, { useState, useRef, KeyboardEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

interface TagInputProps {
    label?: string;
    placeholder?: string;
    value?: string[];
    onChange?: (tags: string[]) => void;
    maxTags?: number;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
    helperText?: string;
    required?: boolean;
    allowDuplicates?: boolean;
    validateTag?: (tag: string) => boolean | string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'error' | 'success';
    className?: string;
    id?: string;
    name?: string;
}

export default function TagInput({
    label,
    placeholder = 'Type and press Enter',
    value = [],
    onChange,
    maxTags,
    disabled = false,
    error = false,
    errorMessage,
    helperText,
    required = false,
    allowDuplicates = false,
    validateTag,
    size = 'md',
    variant = 'default',
    className = '',
    id,
    name,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
    };

    const variantStyles = {
        default: error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
        error: 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500',
        success: 'border-green-500 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500',
    };

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();

        if (!trimmedTag) return;

        if (!allowDuplicates && value.includes(trimmedTag)) {
            return;
        }

        if (maxTags && value.length >= maxTags) {
            return;
        }

        if (validateTag) {
            const validation = validateTag(trimmedTag);
            if (validation === false || typeof validation === 'string') {
                return;
            }
        }

        const newTags = [...value, trimmedTag];
        onChange?.(newTags);
        setInputValue('');
    };

    const removeTag = (indexToRemove: number) => {
        const newTags = value.filter((_, index) => index !== indexToRemove);
        onChange?.(newTags);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue) {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div
                onClick={handleContainerClick}
                className={`
          w-full border rounded-lg transition-all duration-200 bg-white cursor-text
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          min-h-[42px]
        `}
            >
                <div className="flex flex-wrap gap-2 items-center">
                    {value.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium"
                        >
                            {tag}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTag(index);
                                    }}
                                    className="hover:text-blue-900 focus:outline-none"
                                    aria-label={`Remove ${tag}`}
                                >
                                    <FaTimes className="w-3 h-3" />
                                </button>
                            )}
                        </span>
                    ))}

                    <input
                        ref={inputRef}
                        type="text"
                        id={inputId}
                        name={name}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={disabled || (maxTags ? value.length >= maxTags : false)}
                        placeholder={value.length === 0 ? placeholder : ''}
                        className="flex-1 min-w-[120px] outline-none bg-transparent disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            {maxTags && (
                <p className="text-xs text-gray-500 mt-1">
                    {value.length} / {maxTags} tags
                </p>
            )}

            {(error || variant === 'error') && errorMessage && (
                <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
            )}

            {helperText && !error && variant !== 'error' && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}
// components/ui/Loader.tsx
"use client";

import { useEffect, useState } from 'react';

type LoaderType = 'spinner' | 'dots' | 'bars' | 'circular' | 'linear' | 'skeleton' | 'pulse';
type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LoaderColor = 'primary' | 'secondary' | 'danger' | 'white' | 'inherit';
type LoaderSpeed = 'slow' | 'normal' | 'fast';
type LoaderPosition = 'inline' | 'centered' | 'absolute' | 'fixed' | 'relative';

interface LoaderProps {
    // Basic
    type?: LoaderType;
    size?: LoaderSize;
    color?: LoaderColor;
    customColor?: string;

    // Style & Appearance
    thickness?: number;
    speed?: LoaderSpeed;
    customDuration?: string;

    // Positioning
    position?: LoaderPosition;
    fullScreen?: boolean;

    // Content
    text?: string;
    multilineText?: string[];
    showPercentage?: boolean;

    // Progress (Determinate)
    value?: number;
    max?: number;

    // Behavior
    blocking?: boolean;
    backdropOpacity?: number;
    delayMs?: number;

    // Accessibility
    ariaLabel?: string;
    srText?: string;

    // Theme
    darkMode?: boolean;

    // Additional
    className?: string;
}

export default function Loader({
    type = 'spinner',
    size = 'md',
    color = 'primary',
    customColor,
    thickness,
    speed = 'normal',
    customDuration,
    position = 'centered',
    fullScreen = false,
    text,
    multilineText,
    showPercentage = false,
    value,
    max = 100,
    blocking = false,
    backdropOpacity = 90,
    delayMs = 0,
    ariaLabel,
    srText,
    darkMode = false,
    className = '',
}: LoaderProps) {
    const [isVisible, setIsVisible] = useState(delayMs === 0);

    // Anti-flicker: delay showing loader
    useEffect(() => {
        if (delayMs > 0) {
            const timer = setTimeout(() => setIsVisible(true), delayMs);
            return () => clearTimeout(timer);
        }
    }, [delayMs]);

    if (!isVisible) return null;

    // Size mappings
    const sizeClasses = {
        xs: { spinner: 'w-4 h-4', dot: 'w-1.5 h-1.5', bar: 'h-1', stroke: 2 },
        sm: { spinner: 'w-6 h-6', dot: 'w-2 h-2', bar: 'h-1.5', stroke: 2 },
        md: { spinner: 'w-10 h-10', dot: 'w-3 h-3', bar: 'h-2', stroke: 3 },
        lg: { spinner: 'w-16 h-16', dot: 'w-4 h-4', bar: 'h-3', stroke: 4 },
        xl: { spinner: 'w-24 h-24', dot: 'w-5 h-5', bar: 'h-4', stroke: 5 },
    };

    // Color mappings
    const colorClasses = {
        primary: darkMode ? 'border-blue-400' : 'border-blue-600',
        secondary: darkMode ? 'border-gray-400' : 'border-gray-600',
        danger: darkMode ? 'border-red-400' : 'border-red-600',
        white: 'border-white',
        inherit: 'border-current',
    };

    const bgColorClasses = {
        primary: darkMode ? 'bg-blue-400' : 'bg-blue-600',
        secondary: darkMode ? 'bg-gray-400' : 'bg-gray-600',
        danger: darkMode ? 'bg-red-400' : 'bg-red-600',
        white: 'bg-white',
        inherit: 'bg-current',
    };

    // Speed mappings
    const speedDurations = {
        slow: '2s',
        normal: '1s',
        fast: '0.5s',
    };

    const animationDuration = customDuration || speedDurations[speed];
    const strokeWidth = thickness || sizeClasses[size].stroke;

    // Calculate percentage
    const percentage = value !== undefined ? Math.round((value / max) * 100) : 0;

    // Render different loader types
    const renderLoader = () => {
        const loaderStyle = customColor ? { borderColor: customColor, color: customColor } : {};
        const bgStyle = customColor ? { backgroundColor: customColor } : {};

        switch (type) {
            case 'spinner':
                return (
                    <div
                        className={`${sizeClasses[size].spinner} border-${strokeWidth} ${customColor ? '' : colorClasses[color]
                            } border-t-transparent rounded-full animate-spin`}
                        style={{
                            animationDuration,
                            ...(customColor && { borderColor: customColor, borderTopColor: 'transparent' })
                        }}
                        role="status"
                        aria-label={ariaLabel || 'Loading'}
                        aria-busy="true"
                    />
                );

            case 'dots':
                return (
                    <div className="flex items-center gap-2" role="status" aria-busy="true" aria-label={ariaLabel || 'Loading'}>
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`${sizeClasses[size].dot} rounded-full ${customColor ? '' : bgColorClasses[color]
                                    } animate-bounce`}
                                style={{
                                    animationDuration,
                                    animationDelay: `${i * 0.15}s`,
                                    ...bgStyle,
                                }}
                            />
                        ))}
                    </div>
                );

            case 'bars':
                return (
                    <div className="flex items-center gap-1" role="status" aria-busy="true" aria-label={ariaLabel || 'Loading'}>
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-1 ${sizeClasses[size].spinner.split(' ')[1]} ${customColor ? '' : bgColorClasses[color]
                                    } animate-pulse`}
                                style={{
                                    animationDuration,
                                    animationDelay: `${i * 0.1}s`,
                                    ...bgStyle,
                                }}
                            />
                        ))}
                    </div>
                );

            case 'circular':
                return (
                    <svg
                        className={sizeClasses[size].spinner}
                        viewBox="0 0 50 50"
                        role="status"
                        aria-busy="true"
                        aria-label={ariaLabel || 'Loading'}
                    >
                        <circle
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            opacity="0.2"
                            className={customColor ? '' : colorClasses[color].replace('border-', 'text-')}
                            style={loaderStyle}
                        />
                        <circle
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeDasharray="80 100"
                            strokeLinecap="round"
                            className={`${customColor ? '' : colorClasses[color].replace('border-', 'text-')} origin-center animate-spin`}
                            style={{ animationDuration, ...loaderStyle }}
                        />
                    </svg>
                );

            case 'linear':
                const isDeterminate = value !== undefined;
                return (
                    <div className="w-full max-w-md" role="status" aria-busy="true" aria-label={ariaLabel || 'Loading'}>
                        <div className={`w-full ${sizeClasses[size].bar} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
                            {isDeterminate ? (
                                <div
                                    className={`h-full ${customColor ? '' : bgColorClasses[color]} transition-all duration-300 ease-out rounded-full`}
                                    style={{ width: `${percentage}%`, ...bgStyle }}
                                    role="progressbar"
                                    aria-valuenow={value}
                                    aria-valuemin={0}
                                    aria-valuemax={max}
                                />
                            ) : (
                                <div
                                    className={`h-full ${customColor ? '' : bgColorClasses[color]} rounded-full animate-pulse`}
                                    style={{
                                        width: '30%',
                                        animationDuration,
                                        animation: 'slide 1.5s ease-in-out infinite',
                                        ...bgStyle
                                    }}
                                />
                            )}
                        </div>
                        {isDeterminate && showPercentage && (
                            <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400 font-medium">
                                {percentage}%
                            </p>
                        )}
                    </div>
                );

            case 'skeleton':
                return (
                    <div className="w-full space-y-3 animate-pulse" role="status" aria-busy="true" aria-label={ariaLabel || 'Loading content'}>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                );

            case 'pulse':
                return (
                    <div
                        className={`${sizeClasses[size].spinner} rounded-full ${customColor ? '' : bgColorClasses[color]
                            } animate-ping`}
                        style={{ animationDuration, ...bgStyle }}
                        role="status"
                        aria-busy="true"
                        aria-label={ariaLabel || 'Loading'}
                    />
                );

            default:
                return null;
        }
    };

    // Content wrapper with text
    const loaderContent = (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            {renderLoader()}
            {text && (
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {text}
                </p>
            )}
            {multilineText && multilineText.length > 0 && (
                <div className="text-center space-y-1">
                    {multilineText.map((line, idx) => (
                        <p key={idx} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {line}
                        </p>
                    ))}
                </div>
            )}
            {srText && <span className="sr-only">{srText}</span>}
        </div>
    );

    // Position wrappers
    const positionClasses = {
        inline: 'inline-flex',
        centered: 'flex items-center justify-center',
        absolute: 'absolute inset-0 flex items-center justify-center',
        fixed: 'fixed inset-0 flex items-center justify-center',
        relative: 'relative flex items-center justify-center',
    };

    // Fullscreen override
    if (fullScreen || position === 'fixed') {
        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center ${blocking ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                style={{
                    backgroundColor: darkMode
                        ? `rgba(17, 24, 39, ${backdropOpacity / 100})`
                        : `rgba(255, 255, 255, ${backdropOpacity / 100})`,
                }}
            >
                <div className="pointer-events-none">{loaderContent}</div>
            </div>
        );
    }

    // Absolute positioning with optional blocking
    if (position === 'absolute') {
        return (
            <div
                className={`absolute inset-0 z-40 flex items-center justify-center ${blocking ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                style={{
                    backgroundColor: blocking
                        ? darkMode
                            ? `rgba(17, 24, 39, ${backdropOpacity / 100})`
                            : `rgba(255, 255, 255, ${backdropOpacity / 100})`
                        : 'transparent',
                }}
            >
                <div className="pointer-events-none">{loaderContent}</div>
            </div>
        );
    }

    // Default positioning
    return (
        <div className={`${positionClasses[position]} p-4`}>
            {loaderContent}
        </div>
    );
}

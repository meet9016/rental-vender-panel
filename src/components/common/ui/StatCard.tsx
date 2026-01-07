// components/common/ui/StatCard.tsx
'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Info, RefreshCw, AlertCircle, } from 'lucide-react';

/* ================= TYPES ================= */

export type StatCardVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type StatCardSize = 'compact' | 'regular' | 'large';
export type StatCardStyle = 'light' | 'dark' | 'outlined' | 'filled' | 'gradient';
export type TrendType = 'increase' | 'decrease' | 'neutral';
export type PresetType = 'kpi' | 'status' | 'progress' | 'comparison' | 'alert';

interface TrendConfig {
    value: string | number;
    type: TrendType;
    comparison?: string; // "vs yesterday", "vs last week"
    showIcon?: boolean;
}

interface AlertBadgeConfig {
    show: boolean;
    type?: 'warning' | 'error' | 'info';
    message?: string;
    pulse?: boolean;
}

interface LoadingState {
    isLoading?: boolean;
    skeletonWidth?: string;
}

interface ProgressConfig {
    show: boolean;
    value: number; // 0-100
    max?: number;
    color?: string;
    showLabel?: boolean;
}

export interface StatCardProps {
    // Core Content
    title: string;
    value: string | number;
    subtitle?: string;
    description?: string;
    unit?: string; // "%", "$", "₹", "users", "orders"

    // Icon
    icon?: LucideIcon;
    iconBgColor?: string;
    iconColor?: string;
    emoji?: string; // Alternative to icon

    // Visual Variants
    variant?: StatCardVariant;
    size?: StatCardSize;
    style?: StatCardStyle;

    // Trend
    trend?: TrendConfig;

    // Progress
    progress?: ProgressConfig;

    // Alert/Status
    alertBadge?: AlertBadgeConfig;
    badge?: string; // Small badge text

    // Time Context
    timeContext?: string; // "Today", "This week", "Last 30 days"
    lastUpdated?: string | Date;

    // Interaction
    onClick?: () => void;
    onRefresh?: () => void;
    href?: string;
    showInfoIcon?: boolean;
    infoTooltip?: string;

    // States
    loading?: LoadingState;
    disabled?: boolean;
    isEmpty?: boolean;
    hasError?: boolean;
    errorMessage?: string;

    // Customization
    className?: string;
    valueClassName?: string;
    customColor?: string;
    alignment?: 'left' | 'center' | 'right';

    // Formatting
    formatValue?: (value: string | number) => string;
    locale?: string;

    // Preset
    preset?: PresetType;
}

/* ================= HELPER FUNCTIONS ================= */

const formatNumber = (value: number, locale: string = 'en-US'): string => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString(locale);
};

const getVariantStyles = (variant: StatCardVariant, style: StatCardStyle) => {
    const variants = {
        primary: {
            light: 'bg-white border-blue-200',
            dark: 'bg-blue-900 border-blue-800 text-white',
            outlined: 'bg-white border-2 border-blue-500',
            filled: 'bg-blue-50 border-blue-200',
            gradient: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
        },
        secondary: {
            light: 'bg-white border-gray-200',
            dark: 'bg-gray-900 border-gray-800 text-white',
            outlined: 'bg-white border-2 border-gray-500',
            filled: 'bg-gray-50 border-gray-200',
            gradient: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200',
        },
        success: {
            light: 'bg-white border-green-200',
            dark: 'bg-green-900 border-green-800 text-white',
            outlined: 'bg-white border-2 border-green-500',
            filled: 'bg-green-50 border-green-200',
            gradient: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
        },
        danger: {
            light: 'bg-white border-red-200',
            dark: 'bg-red-900 border-red-800 text-white',
            outlined: 'bg-white border-2 border-red-500',
            filled: 'bg-red-50 border-red-200',
            gradient: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
        },
        warning: {
            light: 'bg-white border-yellow-200',
            dark: 'bg-yellow-900 border-yellow-800 text-white',
            outlined: 'bg-white border-2 border-yellow-500',
            filled: 'bg-yellow-50 border-yellow-200',
            gradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
        },
        info: {
            light: 'bg-white border-cyan-200',
            dark: 'bg-cyan-900 border-cyan-800 text-white',
            outlined: 'bg-white border-2 border-cyan-500',
            filled: 'bg-cyan-50 border-cyan-200',
            gradient: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
        },
    };

    return variants[variant][style];
};

const getSizeStyles = (size: StatCardSize) => {
    const sizes = {
        compact: 'p-3',
        regular: 'p-5',
        large: 'p-6',
    };
    return sizes[size];
};

const getTrendColor = (type: TrendType) => {
    if (type === 'increase') return 'text-green-600';
    if (type === 'decrease') return 'text-red-600';
    return 'text-gray-600';
};

const getTrendIcon = (type: TrendType) => {
    if (type === 'increase') return TrendingUp;
    if (type === 'decrease') return TrendingDown;
    return null;
};

/* ================= COMPONENT ================= */

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    description,
    unit = '',

    icon: Icon,
    iconBgColor = 'bg-blue-50',
    iconColor = 'text-blue-600',
    emoji,

    variant = 'secondary',
    size = 'regular',
    style = 'light',

    trend,
    progress,
    alertBadge,
    badge,

    timeContext,
    lastUpdated,

    onClick,
    onRefresh,
    href,
    showInfoIcon = false,
    infoTooltip,

    loading,
    disabled = false,
    isEmpty = false,
    hasError = false,
    errorMessage,

    className = '',
    valueClassName = '',
    customColor,
    alignment = 'left',

    formatValue,
    locale = 'en-US',

    preset,
}) => {
    // Apply preset configurations
    React.useEffect(() => {
        if (preset === 'kpi') {
            // KPI preset: Show trend, large value
        } else if (preset === 'status') {
            // Status preset: Show badge, colored border
        } else if (preset === 'progress') {
            // Progress preset: Show progress bar
        }
    }, [preset]);

    // Format value
    const displayValue = React.useMemo(() => {
        if (formatValue) return formatValue(value);
        if (typeof value === 'number') return formatNumber(value, locale);
        return value;
    }, [value, formatValue, locale]);

    // Determine if clickable
    const isClickable = Boolean(onClick || href);

    // Build class names
    const baseStyles = 'rounded-xl border transition-all duration-200';
    const variantStyles = getVariantStyles(variant, style);
    const sizeStyles = getSizeStyles(size);
    const interactionStyles = isClickable
        ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
        : 'hover:shadow-md';
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const alignmentStyles = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : '';

    // Text color based on style
    const textColor = style === 'dark' ? 'text-white' : 'text-gray-900';
    const subtitleColor = style === 'dark' ? 'text-gray-300' : 'text-gray-500';

    // Handle click
    const handleClick = () => {
        if (disabled) return;
        if (href) {
            window.location.href = href;
        } else if (onClick) {
            onClick();
        }
    };

    // Loading skeleton
    if (loading?.isLoading) {
        return (
            <div className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className} animate-pulse`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className={`h-8 bg-gray-200 rounded ${loading.skeletonWidth || 'w-32'}`}></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    {Icon && <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>}
                </div>
            </div>
        );
    }

    // Error state
    if (hasError) {
        return (
            <div className={`${baseStyles} border-red-200 bg-red-50 ${sizeStyles} ${className}`}>
                <div className="flex items-center gap-3">
                    <AlertCircle size={24} className="text-red-600" />
                    <div>
                        <p className="font-medium text-red-900">{title}</p>
                        <p className="text-sm text-red-600">{errorMessage || 'Error loading data'}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (isEmpty) {
        return (
            <div className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}>
                <div className="text-center py-4">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-xs text-gray-400 mt-1">No data available</p>
                </div>
            </div>
        );
    }

    const TrendIcon = trend?.showIcon !== false && trend ? getTrendIcon(trend.type) : null;

    return (
        <div
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${interactionStyles} ${disabledStyles} ${alignmentStyles} ${className}`}
            onClick={handleClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            style={customColor ? { borderColor: customColor } : undefined}
        >
            {/* Alert Badge */}
            {alertBadge?.show && (
                <div className="flex items-center gap-2 mb-3">
                    <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${alertBadge.type === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : alertBadge.type === 'error'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                    >
                        {alertBadge.pulse && (
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${alertBadge.type === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                                }`}></span>
                        )}
                        {alertBadge.message}
                    </span>
                </div>
            )}

            <div className={`flex items-start ${alignment === 'center' ? 'justify-center' : 'justify-between'}`}>
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-medium ${subtitleColor}`}>{title}</p>
                        {badge && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {badge}
                            </span>
                        )}
                        {showInfoIcon && (
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                title={infoTooltip}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.alert(infoTooltip);
                                }}
                            >
                                <Info size={14} />
                            </button>
                        )}
                        {onRefresh && (
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRefresh();
                                }}
                            >
                                <RefreshCw size={14} />
                            </button>
                        )}
                    </div>

                    {/* Value */}
                    <h3 className={`text-2xl font-bold ${textColor} mb-1 ${valueClassName}`}>
                        {displayValue}{unit && <span className="text-lg ml-1">{unit}</span>}
                    </h3>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className={`text-xs ${subtitleColor}`}>{subtitle}</p>
                    )}

                    {/* Description */}
                    {description && (
                        <p className={`text-xs ${subtitleColor} mt-1`}>{description}</p>
                    )}

                    {/* Trend */}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            {TrendIcon && <TrendIcon size={14} className={getTrendColor(trend.type)} />}
                            <span className={`text-xs font-medium ${getTrendColor(trend.type)}`}>
                                {typeof trend.value === 'number' ? `${trend.value}%` : trend.value}
                            </span>
                            <span className={`text-xs ${subtitleColor}`}>
                                {trend.comparison || 'This month'}
                            </span>
                        </div>
                    )}

                    {/* Time Context */}
                    {timeContext && !trend && (
                        <p className={`text-xs ${subtitleColor} mt-2`}>{timeContext}</p>
                    )}

                    {/* Last Updated */}
                    {lastUpdated && (
                        <p className={`text-xs ${subtitleColor} mt-1`}>
                            Updated: {typeof lastUpdated === 'string' ? lastUpdated : lastUpdated.toLocaleString()}
                        </p>
                    )}

                    {/* Progress Bar */}
                    {progress?.show && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                                {progress.showLabel && (
                                    <span className={`text-xs ${subtitleColor}`}>
                                        {progress.value}%
                                    </span>
                                )}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${progress.color || 'bg-blue-600'
                                        }`}
                                    style={{ width: `${Math.min(progress.value, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Icon or Emoji */}
                {(Icon || emoji) && alignment !== 'center' && (
                    <div className={`${emoji ? 'text-3xl' : `p-3 rounded-lg ${iconBgColor}`}`}>
                        {emoji ? (
                            <span>{emoji}</span>
                        ) : Icon ? (
                            <Icon size={24} className={iconColor} />
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
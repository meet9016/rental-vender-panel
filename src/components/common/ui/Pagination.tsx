// components/common/ui/Pagination.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';

/* ================= TYPES ================= */

export type PaginationVariant = 'primary' | 'secondary' | 'minimal';
export type PaginationSize = 'compact' | 'regular' | 'large';
export type PaginationStyle = 'rounded' | 'square';
export type PaginationMode = 'simple' | 'full' | 'compact' | 'infinite' | 'server';

interface PageInfo {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords?: number;
}

export interface PaginationProps {
    // Core - Required
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;

    // Core - Optional
    pageSize?: number;
    totalRecords?: number;
    onPageSizeChange?: (size: number) => void;

    // Page Size Options
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
    rememberPageSize?: boolean;
    pageSizeStorageKey?: string;

    // Navigation Controls
    showPageInput?: boolean;
    showFirstLastButtons?: boolean;
    showPreviousNextButtons?: boolean;
    showPageNumbers?: boolean;
    maxVisiblePages?: number;

    // Visual
    variant?: PaginationVariant;
    size?: PaginationSize;
    style?: PaginationStyle;
    mode?: PaginationMode;

    // States
    loading?: boolean;
    disabled?: boolean;
    isEmpty?: boolean;
    hasError?: boolean;

    // Information Display
    showInfo?: boolean;
    showRangeInfo?: boolean;
    infoTemplate?: (info: PageInfo) => string;

    // Behavior
    autoScrollToTop?: boolean;
    scrollOffset?: number;
    debounceMs?: number;
    zeroBasedIndex?: boolean;

    // Customization
    className?: string;
    labels?: {
        previous?: string;
        next?: string;
        first?: string;
        last?: string;
        rowsPerPage?: string;
        goToPage?: string;
        showing?: string;
        of?: string;
        page?: string;
    };

    // Callbacks
    onFirstPage?: () => void;
    onLastPage?: () => void;
    onPreviousPage?: () => void;
    onNextPage?: () => void;

    // RTL Support
    rtl?: boolean;

    // Accessibility
    ariaLabel?: string;
}

/* ================= HELPER FUNCTIONS ================= */

const getPageNumbers = (
    currentPage: number,
    totalPages: number,
    maxVisible: number = 7
): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }
    }

    return pages;
};

const getRangeInfo = (
    currentPage: number,
    pageSize: number,
    totalRecords?: number
): { start: number; end: number; total: number } => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = totalRecords
        ? Math.min(currentPage * pageSize, totalRecords)
        : currentPage * pageSize;
    const total = totalRecords || 0;

    return { start, end, total };
};

const scrollToTop = (offset: number = 0) => {
    window.scrollTo({ top: offset, behavior: 'smooth' });
};

/* ================= COMPONENT ================= */

const Pagination: React.FC<PaginationProps> = ({
    // Core
    currentPage,
    totalPages,
    onPageChange,
    pageSize = 10,
    totalRecords,
    onPageSizeChange,

    // Page Size
    pageSizeOptions = [10, 25, 50, 100],
    showPageSizeSelector = true,
    rememberPageSize = false,
    pageSizeStorageKey = 'pagination-page-size',

    // Navigation
    showPageInput = true,
    showFirstLastButtons = true,
    showPreviousNextButtons = true,
    showPageNumbers = true,
    maxVisiblePages = 7,

    // Visual
    variant = 'primary',
    size = 'regular',
    style = 'rounded',
    mode = 'full',

    // States
    loading = false,
    disabled = false,
    isEmpty = false,
    hasError = false,

    // Info
    showInfo = true,
    showRangeInfo = true,
    infoTemplate,

    // Behavior
    autoScrollToTop = false,
    scrollOffset = 0,
    debounceMs = 0,
    zeroBasedIndex = false,

    // Customization
    className = '',
    labels = {},

    // Callbacks
    onFirstPage,
    onLastPage,
    onPreviousPage,
    onNextPage,

    // RTL
    rtl = false,

    // Accessibility
    ariaLabel = 'Pagination Navigation',
}) => {
    const [pageInput, setPageInput] = useState(currentPage.toString());
    const [internalPageSize, setInternalPageSize] = useState(pageSize);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    // Default labels
    const defaultLabels = {
        previous: 'Previous',
        next: 'Next',
        first: 'First',
        last: 'Last',
        rowsPerPage: 'Rows per page:',
        goToPage: 'Go to page:',
        showing: 'Showing',
        of: 'of',
        page: 'Page',
        ...labels,
    };

    // Load saved page size
    useEffect(() => {
        if (rememberPageSize && typeof window !== 'undefined') {
            const saved = localStorage.getItem(pageSizeStorageKey);
            if (saved) {
                const size = parseInt(saved);
                if (pageSizeOptions.includes(size)) {
                    setInternalPageSize(size);
                    onPageSizeChange?.(size);
                }
            }
        }
    }, []);

    // Sync page input with current page
    useEffect(() => {
        setPageInput(currentPage.toString());
    }, [currentPage]);

    // Handle page change with optional features
    const handlePageChange = useCallback((page: number) => {
        if (disabled || loading) return;

        const adjustedPage = zeroBasedIndex ? page - 1 : page;

        if (debounceMs > 0) {
            if (debounceTimer) clearTimeout(debounceTimer);
            const timer = setTimeout(() => {
                onPageChange(adjustedPage);
                if (autoScrollToTop) scrollToTop(scrollOffset);
            }, debounceMs);
            setDebounceTimer(timer);
        } else {
            onPageChange(adjustedPage);
            if (autoScrollToTop) scrollToTop(scrollOffset);
        }
    }, [disabled, loading, zeroBasedIndex, debounceMs, onPageChange, autoScrollToTop, scrollOffset]);

    // Page size change handler
    const handlePageSizeChange = (size: number) => {
        setInternalPageSize(size);
        onPageSizeChange?.(size);

        // Save to localStorage if enabled
        if (rememberPageSize && typeof window !== 'undefined') {
            localStorage.setItem(pageSizeStorageKey, size.toString());
        }

        // Reset to first page
        handlePageChange(1);
    };

    // Page input handlers
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPageInput(e.target.value);
    };

    const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const page = parseInt(pageInput);
            if (page >= 1 && page <= totalPages) {
                handlePageChange(page);
            } else {
                setPageInput(currentPage.toString());
            }
        }
    };

    const handlePageInputBlur = () => {
        const page = parseInt(pageInput);
        if (page >= 1 && page <= totalPages) {
            handlePageChange(page);
        } else {
            setPageInput(currentPage.toString());
        }
    };

    // Navigation handlers
    const goToFirstPage = () => {
        handlePageChange(1);
        onFirstPage?.();
    };

    const goToLastPage = () => {
        handlePageChange(totalPages);
        onLastPage?.();
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
            onPreviousPage?.();
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
            onNextPage?.();
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (disabled || loading) return;

            if (e.key === 'ArrowLeft' && !rtl) {
                goToPreviousPage();
            } else if (e.key === 'ArrowRight' && !rtl) {
                goToNextPage();
            } else if (e.key === 'ArrowLeft' && rtl) {
                goToNextPage();
            } else if (e.key === 'ArrowRight' && rtl) {
                goToPreviousPage();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPage, totalPages, disabled, loading, rtl]);

    // Get range info
    const rangeInfo = totalRecords ? getRangeInfo(currentPage, internalPageSize, totalRecords) : null;

    // Get page numbers
    const pageNumbers = getPageNumbers(currentPage, totalPages, maxVisiblePages);

    // Variant styles
    const variantStyles = {
        primary: 'text-blue-600 border-blue-300',
        secondary: 'text-gray-600 border-gray-300',
        minimal: 'text-gray-600 border-transparent',
    };

    // Size styles
    const sizeStyles = {
        compact: 'text-xs gap-1',
        regular: 'text-sm gap-1',
        large: 'text-base gap-2',
    };

    const buttonSizeStyles = {
        compact: 'p-1.5',
        regular: 'p-2',
        large: 'p-3',
    };

    // Style
    const borderRadius = style === 'rounded' ? 'rounded-lg' : 'rounded';

    // Mode-specific rendering
    if (mode === 'simple') {
        return (
            <div className={`flex items-center justify-between px-4 py-3 ${className}`}>
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1 || disabled || loading}
                    className={`${buttonSizeStyles[size]} ${borderRadius} border ${variantStyles[variant]} hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronLeft size={18} />}
                </button>

                <span className="text-sm text-gray-600">
                    {defaultLabels.page} {currentPage} {defaultLabels.of} {totalPages}
                </span>

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || disabled || loading}
                    className={`${buttonSizeStyles[size]} ${borderRadius} border ${variantStyles[variant]} hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                </button>
            </div>
        );
    }

    if (mode === 'compact') {
        return (
            <div className={`flex items-center justify-center gap-2 px-4 py-3 ${className}`}>
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1 || disabled || loading}
                    className={`${buttonSizeStyles[size]} ${borderRadius} border ${variantStyles[variant]} hover:bg-gray-50 transition-colors disabled:opacity-50`}
                >
                    <ChevronLeft size={16} />
                </button>

                <span className="text-sm px-3 py-1 border ${borderRadius} bg-gray-50">
                    {currentPage} / {totalPages}
                </span>

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || disabled || loading}
                    className={`${buttonSizeStyles[size]} ${borderRadius} border ${variantStyles[variant]} hover:bg-gray-50 transition-colors disabled:opacity-50`}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        );
    }

    // Empty state
    if (isEmpty) {
        return (
            <div className={`flex items-center justify-center px-6 py-4 text-sm text-gray-500 ${className}`}>
                No data to display
            </div>
        );
    }

    // Error state
    if (hasError) {
        return (
            <div className={`flex items-center justify-center px-6 py-4 text-sm text-red-600 ${className}`}>
                Error loading pagination
            </div>
        );
    }

    // Full mode (default)
    return (
        <div
            className={`flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-200 gap-4 ${className}`}
            role="navigation"
            aria-label={ariaLabel}
        >
            {/* Left: Info & Page Size */}
            <div className="flex items-center gap-4">
                {/* Range Info */}
                {showInfo && showRangeInfo && rangeInfo && (
                    <div className="text-sm text-gray-600">
                        {infoTemplate
                            ? infoTemplate({ currentPage, totalPages, pageSize: internalPageSize, totalRecords })
                            : `${defaultLabels.showing} ${rangeInfo.start}–${rangeInfo.end} ${defaultLabels.of} ${rangeInfo.total}`
                        }
                    </div>
                )}

                {/* Page Info (no total records) */}
                {showInfo && !showRangeInfo && (
                    <div className="text-sm text-gray-600">
                        {defaultLabels.page} {currentPage} {defaultLabels.of} {totalPages}
                    </div>
                )}

                {/* Page Size Selector */}
                {showPageSizeSelector && onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{defaultLabels.rowsPerPage}</span>
                        <select
                            value={internalPageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            disabled={disabled || loading}
                            className={`px-3 py-1.5 text-sm border border-gray-300 ${borderRadius} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right: Navigation */}
            <div className="flex items-center gap-4">
                {/* Page Input */}
                {showPageInput && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{defaultLabels.goToPage}</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={pageInput}
                            onChange={handlePageInputChange}
                            onKeyDown={handlePageInputSubmit}
                            onBlur={handlePageInputBlur}
                            disabled={disabled || loading}
                            className={`w-16 px-3 py-1.5 text-sm text-center border border-gray-300 ${borderRadius} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                            aria-label="Jump to page"
                        />
                    </div>
                )}

                {/* Page Navigation Buttons */}
                <div className={`flex items-center ${sizeStyles[size]}`}>
                    {/* First Page */}
                    {showFirstLastButtons && (
                        <button
                            onClick={goToFirstPage}
                            disabled={currentPage === 1 || disabled || loading}
                            className={`${buttonSizeStyles[size]} ${borderRadius} border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label={defaultLabels.first}
                        >
                            <ChevronsLeft size={18} className="text-gray-600" />
                        </button>
                    )}

                    {/* Previous */}
                    {showPreviousNextButtons && (
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1 || disabled || loading}
                            className={`${buttonSizeStyles[size]} ${borderRadius} border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label={defaultLabels.previous}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin text-gray-600" /> : <ChevronLeft size={18} className="text-gray-600" />}
                        </button>
                    )}

                    {/* Page Numbers */}
                    {showPageNumbers && pageNumbers.map((page, idx) => (
                        <React.Fragment key={idx}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-sm text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => handlePageChange(page as number)}
                                    disabled={disabled || loading}
                                    className={`min-w-[36px] px-3 py-1.5 text-sm ${borderRadius} transition-colors ${currentPage === page
                                            ? 'bg-blue-600 text-white font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    aria-label={`Page ${page}`}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}

                    {/* Next */}
                    {showPreviousNextButtons && (
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || disabled || loading}
                            className={`${buttonSizeStyles[size]} ${borderRadius} bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label={defaultLabels.next}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin text-white" /> : <ChevronRight size={18} className="text-white" />}
                        </button>
                    )}

                    {/* Last Page */}
                    {showFirstLastButtons && (
                        <button
                            onClick={goToLastPage}
                            disabled={currentPage === totalPages || disabled || loading}
                            className={`${buttonSizeStyles[size]} ${borderRadius} border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label={defaultLabels.last}
                        >
                            <ChevronsRight size={18} className="text-gray-600" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pagination;
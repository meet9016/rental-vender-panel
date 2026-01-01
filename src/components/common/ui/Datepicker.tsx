// components/ui/DatePicker.tsx
'use client'
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type SelectionMode = 'single' | 'multiple' | 'range' | 'week' | 'month' | 'year';
type ViewMode = 'day' | 'month' | 'year' | 'decade';
type ValueFormat = 'date' | 'iso' | 'custom';
type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface DateRange {
    start: Date | null;
    end: Date | null;
}

interface PresetOption {
    label: string;
    getValue: () => Date | Date[] | DateRange;
}

interface DisabledDatesConfig {
    dates?: Date[];
    weekends?: boolean;
    weekdays?: number[];
    customFn?: (date: Date) => boolean;
}

interface TimeConfig {
    enabled: boolean;
    format?: '12' | '24';
    stepMinutes?: number;
    showSeconds?: boolean;
}

interface LocaleConfig {
    locale?: string;
    weekStartDay?: WeekStartDay;
    monthNames?: string[];
    dayNames?: string[];
    dateFormat?: string;
}

interface DatePickerProps {
    // 1. SELECTION MODES
    selectionMode?: SelectionMode;

    // 2. VIEW MODES
    defaultView?: ViewMode;
    allowViewSwitch?: boolean;

    // 3. VALUE FORMAT
    valueFormat?: ValueFormat;
    customFormat?: string;
    displayFormat?: string;

    // 4. MIN/MAX RULES
    minDate?: Date;
    maxDate?: Date;
    disablePast?: boolean;
    disableFuture?: boolean;

    // 5. DISABLED DATES
    disabledDates?: DisabledDatesConfig;

    // 6. MULTIPLE DATE SUPPORT
    maxSelectableDates?: number;

    // 7. RANGE SELECTION
    showRangeHover?: boolean;
    autoSwapRange?: boolean;
    allowSameDayRange?: boolean;

    // 8. DEFAULT & CONTROLLED VALUES
    value?: Date | Date[] | DateRange | null;
    defaultValue?: Date | Date[] | DateRange | null;
    onChange?: (value: Date | Date[] | DateRange | null) => void;

    // 9. INPUT FIELD
    placeholder?: string;
    readOnly?: boolean;
    clearable?: boolean;
    showMask?: boolean;

    // 10. CALENDAR BEHAVIOR
    openOnFocus?: boolean;
    closeOnSelect?: boolean;
    inline?: boolean;

    // 11. TIME SUPPORT
    timeConfig?: TimeConfig;

    // 12. NAVIGATION
    showTodayButton?: boolean;
    showResetButton?: boolean;

    // 13. LOCALIZATION
    localeConfig?: LocaleConfig;

    // 14. RESPONSIVENESS
    fullscreenMobile?: boolean;

    // 15. ACCESSIBILITY
    ariaLabel?: string;
    id?: string;

    // 16. STYLING
    className?: string;
    highlightToday?: boolean;
    customDayRenderer?: (date: Date) => React.ReactNode;

    // 17. PRESETS
    presets?: PresetOption[];

    // 18. VALIDATION
    required?: boolean;
    error?: string;

    // 19. CALLBACKS
    onOpen?: () => void;
    onClose?: () => void;
    onMonthChange?: (month: number, year: number) => void;
    onYearChange?: (year: number) => void;
    onClear?: () => void;

    // Additional
    disabled?: boolean;
    name?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day);
};

const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

const isSameMonth = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
};

const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    const time = date.getTime();
    return time >= start.getTime() && time <= end.getTime();
};

const isDateDisabled = (
    date: Date,
    minDate?: Date,
    maxDate?: Date,
    disabledDates?: DisabledDatesConfig,
    disablePast?: boolean,
    disableFuture?: boolean
): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (disablePast && date < today) return true;
    if (disableFuture && date > today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    if (disabledDates) {
        if (disabledDates.dates?.some(d => isSameDay(d, date))) return true;
        if (disabledDates.weekends && (date.getDay() === 0 || date.getDay() === 6)) return true;
        if (disabledDates.weekdays?.includes(date.getDay())) return true;
        if (disabledDates.customFn?.(date)) return true;
    }

    return false;
};

const getWeekDates = (date: Date): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const sunday = new Date(date.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return d;
    });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
    const {
        selectionMode = 'single',
        defaultView = 'day',
        allowViewSwitch = true,
        valueFormat = 'date',
        customFormat = 'YYYY-MM-DD',
        displayFormat = 'MMM DD, YYYY',
        minDate,
        maxDate,
        disablePast = false,
        disableFuture = false,
        disabledDates,
        maxSelectableDates,
        showRangeHover = true,
        autoSwapRange = true,
        allowSameDayRange = true,
        value,
        defaultValue,
        onChange,
        placeholder = 'Select date',
        readOnly = false,
        clearable = true,
        openOnFocus = true,
        closeOnSelect = true,
        inline = false,
        timeConfig,
        showTodayButton = true,
        showResetButton = false,
        localeConfig,
        ariaLabel,
        id,
        className = '',
        highlightToday = true,
        customDayRenderer,
        presets,
        required = false,
        error,
        onOpen,
        onClose,
        onMonthChange,
        onYearChange,
        onClear,
        disabled = false,
        name,
    } = props;

    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================

    const [isOpen, setIsOpen] = useState(inline);
    const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [inputValue, setInputValue] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    useEffect(() => {
        if (value !== undefined) {
            updateFromValue(value);
        } else if (defaultValue) {
            updateFromValue(defaultValue);
        }
    }, [value]);

    useEffect(() => {
        if (!inline) {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    handleClose();
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
            }
        }
    }, [isOpen, inline]);

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const updateFromValue = (val: Date | Date[] | DateRange | null) => {
        if (!val) {
            setInputValue('');
            return;
        }

        if (selectionMode === 'single' && val instanceof Date) {
            setSelectedDate(val);
            setInputValue(formatDate(val, customFormat));
        } else if (selectionMode === 'multiple' && Array.isArray(val)) {
            setSelectedDates(val);
            setInputValue(val.map(d => formatDate(d, customFormat)).join(', '));
        } else if (selectionMode === 'range' && 'start' in val) {
            setSelectedRange(val as DateRange);
            const { start, end } = val as DateRange;
            if (start && end) {
                setInputValue(`${formatDate(start, customFormat)} - ${formatDate(end, customFormat)}`);
            } else if (start) {
                setInputValue(formatDate(start, customFormat));
            }
        }
    };

    const handleOpen = () => {
        if (disabled || readOnly) return;
        setIsOpen(true);
        onOpen?.();
    };

    const handleClose = () => {
        if (inline) return;
        setIsOpen(false);
        onClose?.();
    };

    const handleClear = () => {
        setSelectedDate(null);
        setSelectedDates([]);
        setSelectedRange({ start: null, end: null });
        setInputValue('');
        onChange?.(null);
        onClear?.();
    };

    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date, minDate, maxDate, disabledDates, disablePast, disableFuture)) {
            return;
        }

        switch (selectionMode) {
            case 'single':
                setSelectedDate(date);
                setInputValue(formatDate(date, customFormat));
                onChange?.(date);
                if (closeOnSelect) handleClose();
                break;

            case 'multiple':
                const exists = selectedDates.some(d => isSameDay(d, date));
                let newDates: Date[];

                if (exists) {
                    newDates = selectedDates.filter(d => !isSameDay(d, date));
                } else {
                    if (maxSelectableDates && selectedDates.length >= maxSelectableDates) {
                        return;
                    }
                    newDates = [...selectedDates, date];
                }

                setSelectedDates(newDates);
                setInputValue(newDates.map(d => formatDate(d, customFormat)).join(', '));
                onChange?.(newDates);
                break;

            case 'range':
                if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
                    setSelectedRange({ start: date, end: null });
                    setInputValue(formatDate(date, customFormat));
                } else {
                    let start = selectedRange.start;
                    let end = date;

                    if (autoSwapRange && end < start) {
                        [start, end] = [end, start];
                    }

                    if (!allowSameDayRange && isSameDay(start, end)) {
                        return;
                    }

                    const range = { start, end };
                    setSelectedRange(range);
                    setInputValue(`${formatDate(start, customFormat)} - ${formatDate(end, customFormat)}`);
                    onChange?.(range);

                    if (closeOnSelect) handleClose();
                }
                break;

            case 'week':
                const weekDates = getWeekDates(date);
                setSelectedDates(weekDates);
                setInputValue(`Week of ${formatDate(weekDates[0], customFormat)}`);
                onChange?.(weekDates);
                if (closeOnSelect) handleClose();
                break;

            case 'month':
                const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
                setSelectedDate(monthStart);
                setInputValue(`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
                onChange?.(monthStart);
                if (closeOnSelect) handleClose();
                break;

            case 'year':
                const yearStart = new Date(date.getFullYear(), 0, 1);
                setSelectedDate(yearStart);
                setInputValue(`${date.getFullYear()}`);
                onChange?.(yearStart);
                if (closeOnSelect) handleClose();
                break;
        }
    };

    const handleMonthChange = (increment: number) => {
        let newMonth = currentMonth + increment;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        onMonthChange?.(newMonth, newYear);
        onYearChange?.(newYear);
    };

    const handleYearChange = (increment: number) => {
        const newYear = currentYear + increment;
        setCurrentYear(newYear);
        onYearChange?.(newYear);
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        handleDateClick(today);
    };

    const handlePresetClick = (preset: PresetOption) => {
        const val = preset.getValue();
        updateFromValue(val);
        onChange?.(val as any);
        if (closeOnSelect) handleClose();
    };

    // ============================================================================
    // RENDER HELPERS
    // ============================================================================

    const renderDayView = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const days: (Date | null)[] = [];

        // Previous month days
        for (let i = 0; i < startingDayOfWeek; i++) {
            const prevDate = new Date(currentYear, currentMonth, -startingDayOfWeek + i + 1);
            days.push(prevDate);
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentYear, currentMonth, i));
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(currentYear, currentMonth + 1, i));
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return (
            <div className="grid grid-cols-7 gap-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold py-2 text-gray-500 uppercase">
                        {day}
                    </div>
                ))}
                {days.map((date, idx) => {
                    if (!date) return <div key={idx} />;

                    const isCurrentMonth = date.getMonth() === currentMonth;
                    const isToday = isSameDay(date, today);
                    const isSelected = selectionMode === 'single'
                        ? isSameDay(date, selectedDate)
                        : selectionMode === 'multiple'
                            ? selectedDates.some(d => isSameDay(d, date))
                            : selectionMode === 'range'
                                ? isSameDay(date, selectedRange.start) || isSameDay(date, selectedRange.end)
                                : false;

                    const isInRange = selectionMode === 'range' &&
                        isDateInRange(date, selectedRange.start, selectedRange.end);

                    const isHoverInRange = selectionMode === 'range' &&
                        showRangeHover &&
                        selectedRange.start &&
                        !selectedRange.end &&
                        hoverDate &&
                        isDateInRange(date, selectedRange.start, hoverDate);

                    const disabled = isDateDisabled(date, minDate, maxDate, disabledDates, disablePast, disableFuture);

                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            onMouseEnter={() => setHoverDate(date)}
                            onMouseLeave={() => setHoverDate(null)}
                            disabled={disabled}
                            className={`
                                h-10 w-10
                                flex items-center justify-center
                                rounded-full
                                text-sm font-medium
                                transition-all duration-200

                                ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900 '}

                                ${isToday && highlightToday
                                    ? 'ring-2 ring-blue-500'
                                    : ''
                                }

                                ${isSelected
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : ''
                                }

                                ${isInRange && !isSelected
                                    ? 'bg-blue-100 '
                                    : ''
                                }

                                ${isHoverInRange && !isSelected
                                    ? 'bg-blue-50'
                                    : ''
                                }

                                ${!isSelected && !isInRange && !disabled
                                    ? 'hover:bg-gray-100'
                                    : ''
                                }

                                ${disabled
                                    ? 'opacity-40 cursor-not-allowed'
                                    : 'cursor-pointer'}
                                `}

                        >
                            {customDayRenderer ? customDayRenderer(date) : date.getDate()}
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderMonthView = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return (
            <div className="grid grid-cols-3 gap-2">
                {months.map((month, idx) => (
                    <button
                        key={month}
                        type="button"
                        onClick={() => {
                            setCurrentMonth(idx);
                            if (selectionMode === 'month') {
                                handleDateClick(new Date(currentYear, idx, 1));
                            } else {
                                setViewMode('day');
                            }
                        }}
                        className={`
              py-3 px-4 rounded-md text-sm font-medium transition-all
              ${currentMonth === idx ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
            `}
                    >
                        {month}
                    </button>
                ))}
            </div>
        );
    };

    const renderYearView = () => {
        const startYear = Math.floor(currentYear / 12) * 12;
        const years = Array.from({ length: 12 }, (_, i) => startYear + i);

        return (
            <div className="grid grid-cols-3 gap-2">
                {years.map(year => (
                    <button
                        key={year}
                        type="button"
                        onClick={() => {
                            setCurrentYear(year);
                            if (selectionMode === 'year') {
                                handleDateClick(new Date(year, 0, 1));
                            } else {
                                setViewMode('month');
                            }
                        }}
                        className={`
              py-3 px-4 rounded-md text-sm font-medium transition-all text-gray-900
              ${currentYear === year ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
            `}
                    >
                        {year}
                    </button>
                ))}
            </div>
        );
    };

    const renderView = () => {
        switch (viewMode) {
            case 'day': return renderDayView();
            case 'month': return renderMonthView();
            case 'year': return renderYearView();
            default: return renderDayView();
        }
    };

    // ============================================================================
    // MAIN RENDER
    // ============================================================================

    const calendarContent = (
        <div
            className={` w-[320px] rounded-2xl shadow-xl border bg-white border-gray-200 `}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 ">
                <button
                    type="button"
                    onClick={() => viewMode === 'day' ? handleMonthChange(-1) : handleYearChange(-1)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (allowViewSwitch) {
                            if (viewMode === 'day') setViewMode('month');
                            else if (viewMode === 'month') setViewMode('year');
                        }
                    }}
                    className=" text-base font-semibold text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-lg"
                >
                    {viewMode === 'day' && `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}
                    {viewMode === 'month' && currentYear}
                    {viewMode === 'year' && `${Math.floor(currentYear / 12) * 12} - ${Math.floor(currentYear / 12) * 12 + 11}`}
                </button>

                <button
                    type="button"
                    onClick={() => viewMode === 'day' ? handleMonthChange(1) : handleYearChange(1)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Calendar Body */}
            <div className="p-3">
                {renderView()}
            </div>

            {/* Footer Actions */}
            {(showTodayButton || showResetButton || presets) && (
                <div className="border-t border-gray-200 p-2 flex gap-2 flex-wrap">
                    {showTodayButton && (
                        <button
                            type="button"
                            onClick={handleToday}
                            className="
                            px-3 py-1.5
                            text-sm font-medium
                            rounded-full
                            bg-gray-100
                            hover:bg-gray-200
                            text-gray-700
                        ">
                            Today
                        </button>
                    )}
                    {showResetButton && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="
                                px-3 py-1.5
                                text-sm font-medium
                                rounded-full
                                bg-gray-100
                                hover:bg-gray-200
                                text-gray-700
                            ">
                            Reset
                        </button>
                    )}
                    {presets?.map((preset, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handlePresetClick(preset)}
                            className="
                                px-3 py-1.5
                                text-sm font-medium
                                rounded-full
                                bg-gray-100
                                hover:bg-gray-200
                                text-gray-700
                            ">
                            {preset.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {!inline && (
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        id={id}
                        name={name}
                        value={inputValue}
                        onChange={(e) => !readOnly && setInputValue(e.target.value)}
                        onFocus={() => openOnFocus && handleOpen()}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        disabled={disabled}
                        required={required}
                        aria-label={ariaLabel}
                        className={`
                            w-full px-4 py-2.5 pr-10
                            rounded-xl
                            border
                            transition-all

                            text-gray-900
                            placeholder:text-gray-400

                            focus:outline-none
                            focus:ring-2 focus:ring-blue-500
                            focus:border-blue-500
                            focus:placeholder:text-gray-300

                            ${error
                                ? 'border-red-500 placeholder:text-red-400 focus:ring-red-500'
                                : 'border-gray-300'
                            }

                            ${disabled
                                ? 'bg-gray-100 text-gray-400 placeholder:text-gray-400 cursor-not-allowed'
                                : 'bg-white'
                            }
                            `}
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        {clearable && inputValue && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => isOpen ? handleClose() : handleOpen()}
                            disabled={disabled}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {isOpen && (
                <div className={inline ? '' : 'absolute z-50 mt-2'}>
                    {calendarContent}
                </div>
            )}
        </div>
    );
});

DatePicker.displayName = 'DatePicker';
export type { DateRange };
export default DatePicker;
// components/ui/ImageUpload.tsx
'use client'
import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type UploadMode = 'instant' | 'manual';
export type ValidationMode = 'soft' | 'hard';
export type AspectRatio = '1:1' | '16:9' | '4:3' | '3:2' | '21:9' | 'free';
export type OutputFormat = 'file' | 'base64' | 'url';

export interface ImageDimensions {
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}

export interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    base64?: string;
    url?: string;
    name: string;
    size: number;
    type: string;
    dimensions?: { width: number; height: number };
    progress: number;
    status: 'idle' | 'uploading' | 'success' | 'error';
    error?: string;
}

export interface ImageUploadProps {
    enableClick?: boolean;
    enableDragDrop?: boolean;
    enablePaste?: boolean;
    enableCamera?: boolean;
    multiple?: boolean;
    maxFiles?: number;
    accept?: string[];
    maxSize?: number;
    minSize?: number;
    imageDimensions?: ImageDimensions;
    value?: UploadedImage[];
    onChange?: (images: UploadedImage[]) => void;
    uploadMode?: UploadMode;
    onUpload?: (file: File) => Promise<string>;
    autoRetry?: boolean;
    retryAttempts?: number;
    disabled?: boolean;
    readOnly?: boolean;
    loading?: boolean;
    showPreview?: boolean;
    showFileName?: boolean;
    showFileSize?: boolean;
    previewSize?: 'sm' | 'md' | 'lg';
    gridColumns?: number;
    enableCrop?: boolean;
    enableRotate?: boolean;
    enableFlip?: boolean;
    aspectRatio?: AspectRatio;
    cropBeforeUpload?: boolean;
    enableReorder?: boolean;
    validationMode?: ValidationMode;
    customValidator?: (file: File) => Promise<string | null>;
    checkFileSignature?: boolean;
    sanitizeFilename?: boolean;
    preventSvgXss?: boolean;
    outputFormat?: OutputFormat;
    className?: string;
    dropzoneClassName?: string;
    previewClassName?: string;
    label?: string;
    placeholder?: string;
    emptyState?: React.ReactNode;
    customIcon?: React.ReactNode;
    onSelect?: (files: File[]) => void;
    onUploadStart?: (file: File) => void;
    onProgress?: (id: string, progress: number) => void;
    onSuccess?: (id: string, url: string) => void;
    onError?: (id: string, error: string) => void;
    onRemove?: (id: string) => void;
    onReorder?: (images: UploadedImage[]) => void;
    preset?: 'profile' | 'gallery' | 'document' | 'banner' | 'product';
    ariaLabel?: string;
    id?: string;
    error?: string;
    helperText?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const sanitizeFilename = (filename: string): string => {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .toLowerCase();
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const checkFileSignature = async (file: File): Promise<boolean> => {
    const signatures: { [key: string]: string[] } = {
        'image/jpeg': ['FF D8 FF'],
        'image/png': ['89 50 4E 47'],
        'image/gif': ['47 49 46 38'],
        'image/webp': ['52 49 46 46'],
    };

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4);
            const header = Array.from(arr).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

            const expectedSignatures = signatures[file.type] || [];
            const isValid = expectedSignatures.some(sig => header.startsWith(sig));
            resolve(isValid);
        };
        reader.readAsArrayBuffer(file.slice(0, 4));
    });
};

const getPresetConfig = (preset: string): Partial<ImageUploadProps> => {
    const presets: Record<string, Partial<ImageUploadProps>> = {
        profile: {
            multiple: false,
            accept: ['image/jpeg', 'image/png', 'image/webp'],
            maxSize: 5 * 1024 * 1024,
            aspectRatio: '1:1',
            enableCrop: true,
            cropBeforeUpload: true,
        },
        gallery: {
            multiple: true,
            maxFiles: 20,
            accept: ['image/jpeg', 'image/png', 'image/webp'],
            maxSize: 10 * 1024 * 1024,
            enableReorder: true,
            showPreview: true,
            gridColumns: 3,
        },
        document: {
            multiple: false,
            accept: ['image/jpeg', 'image/png', 'application/pdf'],
            maxSize: 2 * 1024 * 1024,
            validationMode: 'hard',
        },
        banner: {
            multiple: false,
            accept: ['image/jpeg', 'image/png', 'image/webp'],
            maxSize: 5 * 1024 * 1024,
            aspectRatio: '16:9',
            enableCrop: true,
        },
        product: {
            multiple: true,
            maxFiles: 10,
            accept: ['image/jpeg', 'image/png', 'image/webp'],
            maxSize: 5 * 1024 * 1024,
            enableReorder: true,
            showPreview: true,
        },
    };

    return presets[preset] || {};
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ImageUpload: React.FC<ImageUploadProps> = (props) => {
    const presetConfig = props.preset ? getPresetConfig(props.preset) : {};
    const mergedProps = { ...presetConfig, ...props };

    const {
        enableClick = true,
        enableDragDrop = true,
        enablePaste = false, // Changed default to false to prevent issues
        enableCamera = false,
        multiple = false,
        maxFiles = 10,
        accept = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maxSize = 5 * 1024 * 1024,
        minSize,
        imageDimensions,
        value,
        onChange,
        uploadMode = 'instant',
        onUpload,
        autoRetry = false,
        retryAttempts = 3,
        disabled = false,
        readOnly = false,
        loading = false,
        showPreview = true,
        showFileName = true,
        showFileSize = true,
        previewSize = 'md',
        gridColumns = 4,
        enableRotate = false,
        enableReorder = false,
        validationMode = 'hard',
        customValidator,
        checkFileSignature: shouldCheckSignature = true,
        sanitizeFilename: shouldSanitizeFilename = true,
        preventSvgXss = true,
        outputFormat = 'file',
        className = '',
        dropzoneClassName = '',
        previewClassName = '',
        label,
        placeholder = 'Click to upload or drag and drop',
        emptyState,
        customIcon,
        onSelect,
        onUploadStart,
        onProgress,
        onSuccess,
        onError,
        onRemove,
        onReorder,
        error,
        helperText,
        ariaLabel,
        id,
    } = mergedProps;

    // STATE
    const [images, setImages] = useState<UploadedImage[]>(value || []);
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);
    const dragItemRef = useRef<number | null>(null);
    const dragOverItemRef = useRef<number | null>(null);

    // Sync with external value
    useEffect(() => {
        if (value !== undefined) {
            setImages(value);
        }
    }, [value]);

    // Paste handler
    useEffect(() => {
        if (!enablePaste) return;

        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            const files: File[] = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) files.push(file);
                }
            }

            if (files.length > 0) {
                processFiles(files);
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [enablePaste]);

    // Validation
    const validateFile = async (file: File): Promise<string | null> => {
        if (customValidator) {
            const error = await customValidator(file);
            if (error) return error;
        }

        if (!accept.includes(file.type)) {
            return `Invalid file type. Accepted: ${accept.join(', ')}`;
        }

        if (preventSvgXss && file.type === 'image/svg+xml') {
            return 'SVG files are not allowed for security reasons';
        }

        if (shouldCheckSignature) {
            const isValid = await checkFileSignature(file);
            if (!isValid) {
                return 'File signature does not match file type';
            }
        }

        if (maxSize && file.size > maxSize) {
            return `File size must be less than ${formatFileSize(maxSize)}`;
        }

        if (minSize && file.size < minSize) {
            return `File size must be at least ${formatFileSize(minSize)}`;
        }

        if (imageDimensions) {
            try {
                const dims = await getImageDimensions(file);

                if (imageDimensions.minWidth && dims.width < imageDimensions.minWidth) {
                    return `Image width must be at least ${imageDimensions.minWidth}px`;
                }
                if (imageDimensions.maxWidth && dims.width > imageDimensions.maxWidth) {
                    return `Image width must be less than ${imageDimensions.maxWidth}px`;
                }
                if (imageDimensions.minHeight && dims.height < imageDimensions.minHeight) {
                    return `Image height must be at least ${imageDimensions.minHeight}px`;
                }
                if (imageDimensions.maxHeight && dims.height > imageDimensions.maxHeight) {
                    return `Image height must be less than ${imageDimensions.maxHeight}px`;
                }
            } catch (err) {
                return 'Failed to validate image dimensions';
            }
        }

        return null;
    };

    // Process files
    const processFiles = async (fileList: File[]) => {
        if (disabled || readOnly) return;

        let filesToProcess = Array.from(fileList);

        if (!multiple && filesToProcess.length > 1) {
            filesToProcess = [filesToProcess[0]];
        }

        const remainingSlots = maxFiles - images.length;
        if (filesToProcess.length > remainingSlots) {
            filesToProcess = filesToProcess.slice(0, remainingSlots);
        }

        onSelect?.(filesToProcess);

        const newImages: UploadedImage[] = [];
        const errors: { [key: string]: string } = {};

        for (const file of filesToProcess) {
            const id = generateId();
            const validationError = await validateFile(file);

            if (validationError) {
                if (validationMode === 'hard') {
                    errors[id] = validationError;
                    continue;
                } else {
                    errors[id] = validationError;
                }
            }

            const filename = shouldSanitizeFilename ? sanitizeFilename(file.name) : file.name;
            const preview = URL.createObjectURL(file);

            let dimensions;
            try {
                dimensions = await getImageDimensions(file);
            } catch (err) {
                // Ignore
            }

            const uploadedImage: UploadedImage = {
                id,
                file,
                preview,
                name: filename,
                size: file.size,
                type: file.type,
                dimensions,
                progress: 0,
                status: 'idle',
                error: errors[id],
            };

            newImages.push(uploadedImage);
        }

        setValidationErrors(prev => ({ ...prev, ...errors }));

        const updatedImages = multiple ? [...images, ...newImages] : newImages;
        setImages(updatedImages);
        onChange?.(updatedImages);

        // Auto upload
        if (uploadMode === 'instant' && onUpload) {
            for (const img of newImages) {
                if (!errors[img.id]) {
                    uploadImage(img);
                }
            }
        }
    };

    const uploadImage = async (image: UploadedImage, attempt = 1): Promise<void> => {
        if (!onUpload) return;

        try {
            setImages(prev => prev.map(img =>
                img.id === image.id ? { ...img, status: 'uploading' as const, progress: 0 } : img
            ));

            onUploadStart?.(image.file);

            const url = await onUpload(image.file);

            setImages(prev => prev.map(img =>
                img.id === image.id ? {
                    ...img,
                    status: 'success' as const,
                    progress: 100,
                    url,
                    base64: outputFormat === 'base64' ? undefined : undefined
                } : img
            ));

            onSuccess?.(image.id, url);
            onProgress?.(image.id, 100);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';

            if (autoRetry && attempt < retryAttempts) {
                setTimeout(() => {
                    uploadImage(image, attempt + 1);
                }, 1000 * attempt);
            } else {
                setImages(prev => prev.map(img =>
                    img.id === image.id
                        ? { ...img, status: 'error' as const, error: errorMessage }
                        : img
                ));
                onError?.(image.id, errorMessage);
            }
        }
    };

    const removeImage = (id: string) => {
        const image = images.find(img => img.id === id);
        if (image?.preview) {
            URL.revokeObjectURL(image.preview);
        }

        const updatedImages = images.filter(img => img.id !== id);
        setImages(updatedImages);
        onChange?.(updatedImages);
        onRemove?.(id);

        const newErrors = { ...validationErrors };
        delete newErrors[id];
        setValidationErrors(newErrors);
    };

    const retryUpload = (id: string) => {
        const image = images.find(img => img.id === id);
        if (image) {
            uploadImage(image);
        }
    };

    // Drag & Drop
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev + 1);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => {
            const newCount = prev - 1;
            if (newCount === 0) setIsDragging(false);
            return newCount;
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setDragCounter(0);

        if (!enableDragDrop || disabled || readOnly) return;

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        if (files.length > 0) {
            processFiles(files);
        }
    };

    // Reordering
    const handleDragStart = (index: number) => {
        dragItemRef.current = index;
    };

    const handleDragEnterItem = (index: number) => {
        dragOverItemRef.current = index;
    };

    const handleDragEndItem = () => {
        if (dragItemRef.current === null || dragOverItemRef.current === null) return;

        const newImages = [...images];
        const draggedItem = newImages[dragItemRef.current];
        newImages.splice(dragItemRef.current, 1);
        newImages.splice(dragOverItemRef.current, 0, draggedItem);

        setImages(newImages);
        onChange?.(newImages);
        onReorder?.(newImages);

        dragItemRef.current = null;
        dragOverItemRef.current = null;
    };

    // Handlers
    const handleClick = () => {
        if (enableClick && !disabled && !readOnly) {
            fileInputRef.current?.click();
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(Array.from(files));
        }
        e.target.value = '';
    };

    const handleCameraCapture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.setAttribute('capture', 'environment');
            fileInputRef.current.click();
        }
    };

    // Render helpers
    const getPreviewSizeClass = () => {
        const sizes = {
            sm: 'w-20 h-20',
            md: 'w-32 h-32',
            lg: 'w-48 h-48',
        };
        return sizes[previewSize];
    };

    const getGridColumnsClass = () => {
        const cols = {
            1: 'grid-cols-1',
            2: 'grid-cols-2',
            3: 'grid-cols-3',
            4: 'grid-cols-4',
            5: 'grid-cols-5',
            6: 'grid-cols-6',
        };
        return cols[gridColumns as keyof typeof cols] || 'grid-cols-4';
    };

    const renderEmptyState = () => {
        if (emptyState) return emptyState;

        return (
            <div className="flex flex-col items-center justify-center py-12">
                {customIcon || (
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                )}
                <p className="text-gray-600 text-center mb-2">{placeholder}</p>
                <p className="text-sm text-gray-400">
                    {accept.map(type => type.split('/')[1]).join(', ')} up to {formatFileSize(maxSize)}
                </p>
            </div>
        );
    };

    const renderPreview = (image: UploadedImage, index: number) => {
        const hasError = !!image.error || !!validationErrors[image.id];
        const errorMessage = image.error || validationErrors[image.id];

        return (
            <div
                key={image.id}
                draggable={enableReorder && !disabled && !readOnly}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnterItem(index)}
                onDragEnd={handleDragEndItem}
                onDragOver={(e) => e.preventDefault()}
                className={`
                    relative group rounded-lg overflow-hidden border-2
                    ${hasError ? 'border-red-500' : 'border-gray-200'}
                    ${enableReorder ? 'cursor-move' : ''}
                    ${previewClassName}
                `}
            >
                <div className={`${getPreviewSizeClass()} relative bg-gray-100`}>
                    <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-full object-cover"
                    />

                    {image.status === 'uploading' && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-white animate-spin mb-2"></div>
                                <p className="text-white text-sm">{image.progress}%</p>
                            </div>
                        </div>
                    )}

                    {image.status === 'success' && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}

                    {image.status === 'error' && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                            <button
                                onClick={() => retryUpload(image.id)}
                                className="bg-white text-red-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-50"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!disabled && !readOnly && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                                {enableRotate && (
                                    <button className="p-2 bg-white rounded-full hover:bg-gray-100" title="Rotate">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    onClick={() => removeImage(image.id)}
                                    className="p-2 bg-white rounded-full hover:bg-red-100"
                                    title="Remove"
                                >
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {(showFileName || showFileSize) && (
                    <div className="p-2 bg-white">
                        {showFileName && (
                            <p className="text-xs text-gray-700 truncate font-medium">{image.name}</p>
                        )}
                        {showFileSize && (
                            <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                        )}
                        {image.dimensions && (
                            <p className="text-xs text-gray-500">
                                {image.dimensions.width} × {image.dimensions.height}
                            </p>
                        )}
                    </div>
                )}

                {hasError && validationMode === 'soft' && (
                    <div className="p-2 bg-red-50 border-t border-red-200">
                        <p className="text-xs text-red-600">{errorMessage}</p>
                    </div>
                )}
            </div>
        );
    };

    const canUploadMore = images.length < maxFiles;
    const isDisabled = disabled || readOnly || loading || !canUploadMore;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Label */}
            {label && (
                <label className="block text-sm font-medium text-gray-700">{label}</label>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept.join(',')}
                multiple={multiple}
                onChange={handleFileInput}
                className="hidden"
                disabled={isDisabled}
                id={id}
                aria-label={ariaLabel}
            />

            {/* Dropzone */}
            {canUploadMore && (
                <div
                    ref={dropzoneRef}
                    onClick={handleClick}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`
            border-2 border-dashed rounded-lg transition-all
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
            ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50'}
            ${error ? 'border-red-500' : ''}
            ${dropzoneClassName}
          `}
                >
                    {images.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        <div className="p-4 text-center">
                            <p className="text-gray-600">
                                {multiple
                                    ? `Add more images (${images.length}/${maxFiles})`
                                    : 'Click to replace image'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Camera Button */}
            {enableCamera && canUploadMore && (
                <button
                    onClick={handleCameraCapture}
                    disabled={isDisabled}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Photo
                </button>
            )}

            {/* Preview Grid */}
            {showPreview && images.length > 0 && (
                <div className={`grid ${getGridColumnsClass()} gap-4`}>
                    {images.map((image, index) => renderPreview(image, index))}
                </div>
            )}

            {/* Helper Text */}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {/* Upload Button for Manual Mode */}
            {uploadMode === 'manual' && images.length > 0 && onUpload && (
                <button
                    onClick={() => {
                        images.forEach(img => {
                            if (img.status === 'idle') {
                                uploadImage(img);
                            }
                        });
                    }}
                    disabled={images.every(img => img.status !== 'idle')}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Upload All ({images.filter(img => img.status === 'idle').length})
                </button>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
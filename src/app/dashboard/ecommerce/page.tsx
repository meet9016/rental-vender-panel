// app/components-demo/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaUser, FaPlus, FaSave, FaTrash, FaArrowRight, FaEdit, FaEnvelope, FaLock, FaPhone, FaCheck, FaTimes, FaCrown, FaStar, FaInfoCircle, FaCheckCircle, FaUndo, FaSpinner } from "react-icons/fa";
import {
    Button,
    Input,
    Select,
    Modal,
    useToast,
    DatePicker,
    Loader,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Badge,
    Card,
    TextEditor,
    ImageUpload
} from "@/components/common/ui";
import type { UploadedImage } from "@/components/common/ui/ImageUpload";
import type { DateRange } from "@/components/common/ui/Datepicker";
import type { SelectOption } from "@/components/common/ui";

const sampleData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "inactive" },
];

export default function ComponentsDemo() {
    const toast = useToast();
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectValue, setSelectValue] = useState("");
    const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
    const [radioValue, setRadioValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [age, setAge] = useState("");
    const [description, setDescription] = useState("");
    const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
    const [planValue, setPlanValue] = useState("");
    const [selectAllState, setSelectAllState] = useState<"none" | "some" | "all">("none");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [singleDate, setSingleDate] = useState<Date | null>(null);
    const [multipleDates, setMultipleDates] = useState<Date[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
    const [weekDate, setWeekDate] = useState<Date[]>([]);
    const [monthDate, setMonthDate] = useState<Date | null>(null);
    const [editorContent, setEditorContent] = useState("");
    const [simpleEditorContent, setSimpleEditorContent] = useState("");
    const [markdownContent, setMarkdownContent] = useState("");
    const [profileImage, setProfileImage] = useState<UploadedImage[]>([]);
    const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
    const [productImages, setProductImages] = useState<UploadedImage[]>([]);
    const [bannerImage, setBannerImage] = useState<UploadedImage[]>([]);

    const selectOptions: SelectOption[] = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ];

    const roleOptions: SelectOption[] = [
        { value: "admin", label: "Admin", icon: <FaCrown className="text-yellow-500" /> },
        { value: "user", label: "User", icon: <FaUser className="text-blue-500" /> },
        { value: "guest", label: "Guest", icon: <FaStar className="text-gray-400" /> },
    ];

    const permissionOptions: SelectOption[] = [
        { value: "read", label: "Read" },
        { value: "write", label: "Write" },
        { value: "delete", label: "Delete" },
        { value: "admin", label: "Admin Access" },
    ];

    const countryOptions: SelectOption[] = [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
    ];

    const permissionCheckboxOptions = [
        { value: "read", label: "Read Access" },
        { value: "write", label: "Write Access" },
        { value: "delete", label: "Delete Access" },
        { value: "admin", label: "Admin Access", disabled: true },
    ];

    const planRadioOptions = [
        { value: "free", label: "Free Plan", description: "Basic features for personal use" },
        { value: "pro", label: "Pro Plan", description: "Advanced features for professionals" },
        { value: "enterprise", label: "Enterprise", description: "Full features for teams" },
    ];

    const items = ["Item 1", "Item 2", "Item 3", "Item 4"];
    const radioOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];

    const mockUpload = async (file: File): Promise<string> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate random upload success/failure
        if (Math.random() > 0.9) {
            throw new Error('Upload failed - network error');
        }

        // Return mock URL
        return `https://images.example.com/${file.name}`;
    };


    useEffect(() => {
        if (selectedItems.length === 0) setSelectAllState("none");
        else if (selectedItems.length === items.length) setSelectAllState("all");
        else setSelectAllState("some");
    }, [selectedItems]);

    const handleLoadingDemo = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 3000);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Saved successfully!");
        }, 2000);
    };

    const handleSelectAll = () => {
        if (selectAllState === "all") {
            setSelectedItems([]);
        } else {
            setSelectedItems(items);
        }
    };

    const handleFileUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    toast.success("Upload complete!");
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const openModal = (id: string) => setActiveModal(id);
    const closeModal = () => setActiveModal(null);

    const handleAsyncConfirm = async () => {
        setConfirmLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setConfirmLoading(false);
        closeModal();
        toast.success("Action completed!");
    };

    const handleLoadingModal = () => {
        openModal("loading");
        setModalLoading(true);
        setTimeout(() => {
            setModalLoading(false);
            closeModal();
            toast.success("Data loaded!");
        }, 3000);
    };

    // Toast demo handlers
    const handleSimpleToasts = () => {
        toast.success("User created successfully!");
    };

    const handleAdvancedToast = () => {
        toast.success("Profile Updated", {
            title: "Success",
            description: "Your profile has been updated successfully",
            duration: 5000,
        });
    };

    const handleToastWithAction = () => {
        toast.error("Item Deleted", {
            action: {
                label: "Undo",
                onClick: () => toast.info("Item restored!"),
            },
            duration: 5000,
        });
    };

    const handleUpdateToast = () => {
        const id = toast.loading("Saving changes...");
        setTimeout(() => {
            toast.update(id, {
                type: "success",
                message: "Changes saved!",
                persist: false,
                duration: 3000,
            });
        }, 2000);
    };

    const handlePromiseToast = () => {
        const saveUser = () => new Promise((resolve) => setTimeout(resolve, 2000));

        toast.promise(saveUser(), {
            loading: "Saving user...",
            success: "User saved successfully!",
            error: "Failed to save user",
        });
    };

    const handleCustomIcon = () => {
        toast.info("Custom notification", {
            icon: <FaStar className="w-5 h-5 text-yellow-500" />,
        });
    };

    const handlePersistentToast = () => {
        toast.warning("Important message", {
            persist: true,
            description: "This toast won't auto-dismiss. Click X to close.",
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Components Demo</h1>

            {/* Buttons */}
            <Card title="Button Variants & Sizes" subtitle="Different button styles and sizes">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="danger">Danger</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button size="xs">XS</Button>
                        <Button size="sm">SM</Button>
                        <Button size="md">MD</Button>
                        <Button size="lg">LG</Button>
                        <Button size="xl">XL</Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button leftIcon={<FaPlus />}>Add</Button>
                        <Button leftIcon={<FaSave />} variant="secondary">Save</Button>
                        <Button leftIcon={<FaTrash />} variant="danger">Delete</Button>
                        <Button rightIcon={<FaArrowRight />} variant="outline">Next</Button>
                        <Button isLoading={isSaving} onClick={handleSave}>Save Changes</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                </div>
            </Card>

            {/* Inputs */}
            <Card title="Input Variants & Features" subtitle="Text inputs with different states">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Name" placeholder="Enter name" />
                        <Input label="Email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input label="Success" variant="success" isValid placeholder="Valid input" />
                        <Input label="Error" variant="error" error errorMessage="Required field" placeholder="Error state" />
                        <Input label="With Icon" leftIcon={<FaEnvelope />} placeholder="Enter email" />
                        <Input label="Password" type="password" showPasswordToggle value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input isSearch placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <Input label="Number" type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <Input multiline label="Description" placeholder="Enter description..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
            </Card>

            {/* Select */}
            <Card title="Select Variants" subtitle="Dropdown select with features">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select label="Basic Select" options={selectOptions} value={selectValue} onChange={setSelectValue} />

                        <Select label="With Icons" options={roleOptions} />

                        <Select label="Searchable" options={countryOptions} searchable />

                        <Select label="Multi-Select" options={permissionOptions} multiple value={multiSelectValue} onChange={setMultiSelectValue} />

                    </div>
                </div>
            </Card>

            {/* Badges */}
            <Card title="Badges" subtitle="Status indicators and labels">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="danger">Danger</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge size="xs">XS</Badge>
                        <Badge size="sm">SM</Badge>
                        <Badge size="md">MD</Badge>
                        <Badge size="lg">LG</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Badge appearance="solid" variant="primary">Solid</Badge>
                        <Badge appearance="outline" variant="success">Outline</Badge>
                        <Badge appearance="soft" variant="danger">Soft</Badge>
                        <Badge leftIcon={<FaCheck />} variant="success">Verified</Badge>
                        <Badge dot variant="success">Online</Badge>
                        <Badge count={5} variant="danger" />
                        <Badge closable onClose={() => toast.info("Badge closed")}>Tag</Badge>
                    </div>
                </div>
            </Card>

            {/* Checkboxes & Radio */}
            <Card title="Checkboxes & Radio Buttons" subtitle="Form selection controls">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700">Checkboxes</h3>
                            <Checkbox label="Remember me" />
                            <Checkbox label="Subscribe" size="sm" />
                            <Checkbox label="Agree to terms" variant="primary" />
                            <Checkbox
                                label="Select All"
                                checked={selectAllState === "all"}
                                indeterminate={selectAllState === "some"}
                                onChange={handleSelectAll}
                            />
                            <div className="ml-6 space-y-2">
                                {items.map((item) => (
                                    <Checkbox
                                        key={item}
                                        label={item}
                                        checked={selectedItems.includes(item)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedItems([...selectedItems, item]);
                                            } else {
                                                setSelectedItems(selectedItems.filter(i => i !== item));
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700">Radio Buttons</h3>
                            <RadioGroup
                                name="gender"
                                label="Select Gender"
                                options={radioOptions}
                                value={radioValue}
                                onChange={setRadioValue}
                            />
                            <RadioGroup
                                name="plan"
                                label="Choose Plan"
                                options={planRadioOptions}
                                value={planValue}
                                onChange={setPlanValue}
                                size="sm"
                            />
                        </div>
                    </div>
                    <CheckboxGroup
                        name="permissions"
                        label="Permissions"
                        options={permissionCheckboxOptions}
                        value={checkboxValues}
                        onChange={setCheckboxValues}
                        direction="horizontal"
                    />
                </div>
            </Card>

            {/* Modals */}
            <Card title="Modal Dialogs" subtitle="Various modal configurations">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Basic & Sizes</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => openModal("basic")}>Basic</Button>
                            <Button size="sm" onClick={() => openModal("xs")}>XS</Button>
                            <Button size="sm" onClick={() => openModal("sm")}>SM</Button>
                            <Button size="sm" onClick={() => openModal("md")}>MD</Button>
                            <Button size="sm" onClick={() => openModal("lg")}>LG</Button>
                            <Button size="sm" onClick={() => openModal("xl")}>XL</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Variants & Positions</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => openModal("default")}>Default</Button>
                            <Button size="sm" variant="danger" onClick={() => openModal("danger")}>Danger</Button>
                            <Button size="sm" onClick={() => openModal("success")}>Success</Button>
                            <Button size="sm" onClick={() => openModal("top")}>Top</Button>
                            <Button size="sm" onClick={() => openModal("right")}>Right</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Confirmations & Features</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => openModal("confirm")}>Confirm</Button>
                            <Button size="sm" variant="danger" onClick={() => openModal("delete")}>Delete</Button>
                            <Button size="sm" onClick={() => openModal("scrollable")}>Scrollable</Button>
                            <Button size="sm" onClick={() => openModal("async")}>Async</Button>
                            <Button size="sm" onClick={handleLoadingModal}>Loading</Button>
                            <Button size="sm" onClick={() => openModal("composition")}>Composition</Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Toast Notifications */}
            <Card title="Toast Notifications" subtitle="Advanced notification system">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Basic Toasts</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => toast.success("Success message!")}>Success</Button>
                            <Button size="sm" variant="danger" onClick={() => toast.error("Error occurred!")}>Error</Button>
                            <Button size="sm" variant="secondary" onClick={() => toast.info("Information")}>Info</Button>
                            <Button size="sm" onClick={() => toast.warning("Warning message!")}>Warning</Button>
                            <Button size="sm" onClick={() => toast.loading("Loading...")}>Loading</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Advanced Features</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={handleAdvancedToast}>With Title & Description</Button>
                            <Button size="sm" onClick={handleToastWithAction}>With Action Button</Button>
                            <Button size="sm" onClick={handleCustomIcon}>Custom Icon</Button>
                            <Button size="sm" onClick={handlePersistentToast}>Persistent Toast</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">Dynamic & Promise</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={handleUpdateToast}>Update Toast</Button>
                            <Button size="sm" onClick={handlePromiseToast}>Promise Toast</Button>
                            <Button size="sm" variant="outline" onClick={() => toast.dismiss("all")}>Dismiss All</Button>
                            <Button size="sm" variant="outline" onClick={() => toast.clear()}>Clear All</Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Loader - Enhanced Section */}
            <Card title="Loader Components" subtitle="Loading indicators for all scenarios">
                <div className="space-y-8">
                    {/* Loader Types */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Loader Types</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" size="md" />
                                <span className="text-xs text-gray-600">Spinner</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="dots" size="md" />
                                <span className="text-xs text-gray-600">Dots</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="bars" size="md" />
                                <span className="text-xs text-gray-600">Bars</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="circular" size="md" />
                                <span className="text-xs text-gray-600">Circular</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="pulse" size="md" />
                                <span className="text-xs text-gray-600">Pulse</span>
                            </div>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Sizes</h3>
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" size="xs" />
                                <span className="text-xs text-gray-600">XS</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" size="sm" />
                                <span className="text-xs text-gray-600">SM</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" size="md" />
                                <span className="text-xs text-gray-600">MD</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" size="lg" />
                                <span className="text-xs text-gray-600">LG</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" size="xl" />
                                <span className="text-xs text-gray-600">XL</span>
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Colors & Themes</h3>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" color="primary" />
                                <span className="text-xs text-gray-600">Primary</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" color="secondary" />
                                <span className="text-xs text-gray-600">Secondary</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" color="danger" />
                                <span className="text-xs text-gray-600">Danger</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-gray-800 p-4 rounded">
                                <Loader type="spinner" color="white" />
                                <span className="text-xs text-white">White</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" customColor="#10b981" />
                                <span className="text-xs text-gray-600">Custom</span>
                            </div>
                        </div>
                    </div>

                    {/* Speed Control */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Animation Speed</h3>
                        <div className="flex gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" speed="slow" />
                                <span className="text-xs text-gray-600">Slow</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" speed="normal" />
                                <span className="text-xs text-gray-600">Normal</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="spinner" speed="fast" />
                                <span className="text-xs text-gray-600">Fast</span>
                            </div>
                        </div>
                    </div>

                    {/* With Text */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">With Text & Labels</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Loader type="spinner" text="Loading..." />
                            <Loader type="dots" text="Please wait" color="primary" />
                            <Loader
                                type="circular"
                                multilineText={["Processing your request", "This may take a moment"]}
                            />
                        </div>
                    </div>

                    {/* Linear Progress */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Progress Indicators</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Indeterminate</p>
                                <Loader type="linear" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Determinate with percentage</p>
                                <Loader type="linear" value={uploadProgress} showPercentage />
                            </div>
                            <Button
                                onClick={handleFileUpload}
                                disabled={isUploading}
                                size="sm"
                            >
                                {isUploading ? "Uploading..." : "Simulate Upload"}
                            </Button>
                        </div>
                    </div>

                    {/* Skeleton Loader */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Skeleton Loader</h3>
                        <div className="max-w-md">
                            <Loader type="skeleton" />
                        </div>
                    </div>

                    {/* Positioning Examples */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Positioning</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded p-4 h-32 relative">
                                <p className="text-sm text-gray-600 mb-2">Inline</p>
                                <Loader type="spinner" size="sm" position="inline" />
                            </div>
                            <div className="border rounded p-4 h-32 relative">
                                <p className="text-sm text-gray-600 mb-2">Centered</p>
                                <Loader type="dots" size="sm" position="centered" />
                            </div>
                            <div className="border rounded p-4 h-32 relative bg-gray-50">
                                <p className="text-sm text-gray-600 mb-2">Absolute Overlay</p>
                                <Loader type="spinner" size="sm" position="absolute" blocking backdropOpacity={80} />
                            </div>
                        </div>
                    </div>

                    {/* Inline Button Loaders */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Button Loading States</h3>
                        <div className="flex flex-wrap gap-3">
                            <Button disabled>
                                <Loader type="spinner" size="xs" color="white" position="inline" className="mr-2" />
                                Processing...
                            </Button>
                            <Button variant="secondary" disabled>
                                <Loader type="dots" size="xs" position="inline" className="mr-2" />
                                Loading...
                            </Button>
                        </div>
                    </div>

                    {/* Fullscreen Demo */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Fullscreen & Blocking</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={handleLoadingDemo}>
                                Show Fullscreen Loader
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setIsLoading(true)}>
                                Blocking Loader
                            </Button>
                            {isLoading && (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => setIsLoading(false)}>
                                        Hide Loader
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/*Delayed Loading (Anti-Flicker) */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Delayed Loading (Anti-Flicker)</h3>
                        <p className="text-sm text-gray-600">Loader appears after 300ms to prevent flashing on fast responses</p>
                        <Button size="sm" onClick={() => {
                            const start = Date.now();
                            setIsLoading(true);
                            setTimeout(() => {
                                setIsLoading(false);
                                const duration = Date.now() - start;
                                toast.info(`Request completed in ${duration}ms`);
                            }, Math.random() * 2000 + 500);
                        }}>
                            Test Delayed Loader
                        </Button>
                    </div>
                    {/* Context-Aware Examples */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Context-Aware Loading</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Card Loading */}
                            <div className="border rounded-lg p-4 min-h-[200px] relative">
                                <h4 className="font-semibold mb-2">Card Content</h4>
                                <p className="text-sm text-gray-600">Simulated card loading state</p>
                                <Loader
                                    type="spinner"
                                    position="absolute"
                                    blocking
                                    backdropOpacity={95}
                                    text="Loading data..."
                                />
                            </div>

                            {/* Form Loading */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold mb-3">Form Submission</h4>
                                <div className="space-y-2">
                                    <Input placeholder="Name" size="sm" disabled />
                                    <Input placeholder="Email" size="sm" disabled />
                                    <Button size="sm" fullWidth disabled>
                                        <Loader type="spinner" size="xs" color="white" position="inline" className="mr-2" />
                                        Submitting...
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accessibility Demo */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Accessibility Features</h3>
                        <p className="text-sm text-gray-600">All loaders include proper ARIA attributes for screen readers</p>
                        <div className="flex gap-4">
                            <Loader
                                type="spinner"
                                ariaLabel="Loading user data"
                                srText="Please wait while we fetch your data"
                            />
                            <Loader
                                type="circular"
                                ariaLabel="Processing payment"
                                text="Processing..."
                            />
                        </div>
                    </div>

                    {/* Custom Thickness */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Custom Thickness</h3>
                        <div className="flex gap-8">
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="circular" thickness={2} />
                                <span className="text-xs text-gray-600">Thin (2px)</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="circular" thickness={4} />
                                <span className="text-xs text-gray-600">Medium (4px)</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Loader type="circular" thickness={6} />
                                <span className="text-xs text-gray-600">Thick (6px)</span>
                            </div>
                        </div>
                    </div>
                </div>
                {isLoading && (
                    <Loader
                        fullScreen
                        text="Loading..."
                        delayMs={300}
                        blocking
                        backdropOpacity={90}
                    />
                )}
            </Card>

            {/* MODAL DEFINITIONS */}
            <Modal isOpen={activeModal === "basic"} onClose={closeModal} title="Basic Modal" confirmText="Save" onConfirm={() => { closeModal(); toast.success("Saved!"); }}>
                <p className="text-gray-700">This is a basic modal with title, content, and footer actions.</p>
            </Modal>

            <Modal isOpen={activeModal === "xs"} onClose={closeModal} title="Extra Small" size="xs">
                <p className="text-gray-700 text-sm">Compact modal for small content.</p>
            </Modal>

            <Modal isOpen={activeModal === "sm"} onClose={closeModal} title="Small Modal" size="sm">
                <p className="text-gray-700">Perfect for quick messages.</p>
            </Modal>

            <Modal isOpen={activeModal === "md"} onClose={closeModal} title="Medium Modal" size="md">
                <p className="text-gray-700">Default size, suitable for most content.</p>
            </Modal>

            <Modal isOpen={activeModal === "lg"} onClose={closeModal} title="Large Modal" size="lg">
                <p className="text-gray-700">Great for forms or detailed content.</p>
            </Modal>

            <Modal isOpen={activeModal === "xl"} onClose={closeModal} title="Extra Large" size="xl">
                <p className="text-gray-700">Maximum width for complex layouts.</p>
            </Modal>

            <Modal isOpen={activeModal === "default"} onClose={closeModal} title="Default Variant" variant="default">
                <p className="text-gray-700">Standard blue accent.</p>
            </Modal>

            <Modal isOpen={activeModal === "danger"} onClose={closeModal} title="Danger Variant" variant="danger">
                <p className="text-gray-700">Red accent for destructive actions.</p>
            </Modal>

            <Modal isOpen={activeModal === "success"} onClose={closeModal} title="Success Variant" variant="success">
                <p className="text-gray-700">Green accent for success messages.</p>
            </Modal>

            <Modal isOpen={activeModal === "top"} onClose={closeModal} title="Top Position" position="top">
                <p className="text-gray-700">Positioned at the top.</p>
            </Modal>

            <Modal isOpen={activeModal === "right"} onClose={closeModal} title="Right Position" position="right" size="sm">
                <p className="text-gray-700">Slides in from right. Perfect for sidebars.</p>
            </Modal>

            <Modal isOpen={activeModal === "confirm"} onClose={closeModal} type="confirm" title="Confirm Action" description="Are you sure you want to proceed?" confirmText="Proceed" onConfirm={() => { closeModal(); toast.success("Confirmed!"); }} />

            <Modal isOpen={activeModal === "delete"} onClose={closeModal} type="confirm" variant="danger" dangerConfirm title="Delete Item" description="This action cannot be undone." confirmText="Delete" onConfirm={() => { closeModal(); toast.error("Deleted!"); }} />

            <Modal isOpen={activeModal === "scrollable"} onClose={closeModal} title="Scrollable Content" scrollable maxHeight="300px">
                <div className="space-y-4">
                    {Array.from({ length: 15 }, (_, i) => (
                        <p key={i} className="text-gray-700">Paragraph {i + 1}: This is scrollable content.</p>
                    ))}
                </div>
            </Modal>

            <Modal isOpen={activeModal === "async"} onClose={closeModal} title="Async Confirmation" confirmText="Submit" onConfirm={handleAsyncConfirm} confirmLoading={confirmLoading}>
                <p className="text-gray-700">Click submit to see async operation with loading state.</p>
            </Modal>

            <Modal isOpen={activeModal === "loading"} onClose={closeModal} title="Loading Data" isLoading={modalLoading}>
                <p className="text-gray-700">Fetching data from server...</p>
            </Modal>

            <Modal isOpen={activeModal === "composition"} onClose={closeModal} hideHeader hideFooter>
                <Modal.Header className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <h2 className="text-xl font-bold text-white">Composition API</h2>
                </Modal.Header>
                <Modal.Body className="bg-gray-50">
                    <p className="text-gray-700">Using Modal.Header, Modal.Body, and Modal.Footer for full control.</p>
                </Modal.Body>
                <Modal.Footer className="bg-gradient-to-r from-purple-600 to-blue-500">
                    <Button fullWidth variant="outline" onClick={closeModal} className="text-white border-white hover:bg-white/10">Close</Button>
                </Modal.Footer>
            </Modal>

            {/* DatePicker */}
            <Card title="DatePicker Components" subtitle="Date selection with various modes and features">
                <div className="space-y-8">
                    {/* Basic Selection Modes */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Selection Modes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Single Date</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Select a date"
                                    value={singleDate}
                                    onChange={(val) => setSingleDate(val as Date)}
                                    clearable
                                />
                                {singleDate && (
                                    <p className="text-xs text-gray-600 mt-1">Selected: {singleDate.toDateString()}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                <DatePicker
                                    selectionMode="range"
                                    placeholder="Select date range"
                                    value={dateRange}
                                    onChange={(val) => setDateRange(val as DateRange)}
                                    showRangeHover
                                    autoSwapRange
                                    clearable
                                />
                                {dateRange.start && dateRange.end && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        {dateRange.start.toDateString()} - {dateRange.end.toDateString()}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Multiple Dates</label>
                                <DatePicker
                                    selectionMode="multiple"
                                    placeholder="Select multiple dates"
                                    value={multipleDates}
                                    onChange={(val) => setMultipleDates(val as Date[])}
                                    maxSelectableDates={5}
                                    clearable
                                />
                                {multipleDates.length > 0 && (
                                    <p className="text-xs text-gray-600 mt-1">
                                        Selected {multipleDates.length} date(s)
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Week Selection</label>
                                <DatePicker
                                    selectionMode="week"
                                    placeholder="Select a week"
                                    value={weekDate}
                                    onChange={(val) => setWeekDate(val as Date[])}
                                    clearable
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Month Selection</label>
                                <DatePicker
                                    selectionMode="month"
                                    placeholder="Select a month"
                                    defaultView="month"
                                    value={monthDate}
                                    onChange={(val) => setMonthDate(val as Date)}
                                    clearable
                                />
                            </div>
                        </div>
                    </div>

                    {/* Constraints & Validation */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Constraints & Validation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Disable Past Dates</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Future dates only"
                                    disablePast
                                    clearable
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Disable Weekends</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Weekdays only"
                                    disabledDates={{ weekends: true }}
                                    clearable
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Min/Max Range (Next 30 Days)</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Next 30 days only"
                                    minDate={new Date()}
                                    maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                                    clearable
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Required Field</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Required field"
                                    required
                                    error="This field is required"
                                    clearable
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Quick Presets</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">With Date Presets</label>
                                <DatePicker
                                    selectionMode="range"
                                    placeholder="Select or use preset"
                                    presets={[
                                        {
                                            label: 'Today',
                                            getValue: () => ({ start: new Date(), end: new Date() })
                                        },
                                        {
                                            label: 'Last 7 Days',
                                            getValue: () => ({
                                                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                                                end: new Date()
                                            })
                                        },
                                        {
                                            label: 'Last 30 Days',
                                            getValue: () => ({
                                                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                                                end: new Date()
                                            })
                                        },
                                        {
                                            label: 'This Month',
                                            getValue: () => ({
                                                start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                                end: new Date()
                                            })
                                        },
                                    ]}
                                    clearable
                                />
                            </div>
                        </div>
                    </div>

                    {/* States & Variants */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">States & Variants</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Read Only</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Read only"
                                    value={new Date()}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Disabled</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Disabled"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Custom Format (DD/MM/YYYY)</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="DD/MM/YYYY"
                                    customFormat="DD/MM/YYYY"
                                    clearable
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">With Today Button</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Select date"
                                    showTodayButton
                                    showResetButton
                                    clearable
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inline Calendar */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Inline Calendar (Always Open)</h3>
                        <div className="max-w-md">
                            <DatePicker
                                selectionMode="single"
                                inline
                                highlightToday
                                showTodayButton
                            />
                        </div>
                    </div>

                    {/* Advanced Features */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Advanced Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">View Switching (Day ↔ Month ↔ Year)</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Click month/year to switch views"
                                    allowViewSwitch
                                    clearable
                                />
                            </div>
                        </div>
                    </div>

                    {/* Callbacks Demo */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Event Callbacks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">With Event Handlers</label>
                                <DatePicker
                                    selectionMode="single"
                                    placeholder="Select date"
                                    onChange={(date) => toast.info(`Date changed: ${date ? (date as Date).toDateString() : 'cleared'}`)}
                                    onOpen={() => toast.info("Calendar opened")}
                                    onClose={() => toast.info("Calendar closed")}
                                    onClear={() => toast.info("Date cleared")}
                                    clearable
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Text Editor */}
            <Card title="Text Editor" subtitle="Rich text editing with multiple modes and features">
                <div className="space-y-8">
                    {/* Basic Rich Editor */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Rich Text Editor</h3>
                        <TextEditor
                            mode="rich"
                            value={editorContent}
                            onChange={(value) => {
                                setEditorContent(value);
                                console.log("Editor content:", value);
                            }}
                            placeholder="Start typing your content here..."
                            minHeight={200}
                            showCharCount
                            showWordCount
                            validation={{ maxLength: 5000 }}
                        />
                    </div>

                    {/* Preset Examples */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Preset Configurations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Simple Editor</label>
                                <TextEditor
                                    preset="simple"
                                    value={simpleEditorContent}
                                    onChange={(value) => setSimpleEditorContent(value)}
                                    placeholder="Simple editor with basic formatting..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Comment Editor</label>
                                <TextEditor
                                    preset="comment"
                                    placeholder="Leave a comment..."
                                    showCharCount
                                />
                            </div>
                        </div>
                    </div>

                    {/* Markdown Mode */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Markdown Mode</h3>
                        <TextEditor
                            preset="markdown"
                            value={markdownContent}
                            onChange={(value) => setMarkdownContent(value)}
                            placeholder="Write markdown here..."
                            showCharCount
                        />
                    </div>

                    {/* Editor States */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Editor States</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Read Only</label>
                                <TextEditor
                                    mode="readonly"
                                    defaultValue="<p>This content is <strong>read-only</strong> and cannot be edited.</p>"
                                    minHeight={100}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Disabled</label>
                                <TextEditor
                                    disabled
                                    defaultValue="<p>This editor is disabled.</p>"
                                    minHeight={100}
                                />
                            </div>
                        </div>
                    </div>

                    {/* With Validation */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">With Validation</h3>
                        <TextEditor
                            placeholder="Max 500 characters..."
                            validation={{ maxLength: 500, required: true }}
                            error="This field is required and must be under 500 characters"
                            showCharCount
                            minHeight={150}
                        />
                    </div>

                    {/* Email Template */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Email Template Editor</h3>
                        <TextEditor
                            preset="email"
                            placeholder="Compose your email..."
                            fileUpload={{
                                enabled: true,
                                maxSize: 5 * 1024 * 1024, // 5MB
                                allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
                                onUpload: async (file) => {
                                    // Simulate file upload
                                    toast.info(`Uploading ${file.name}...`);
                                    await new Promise(resolve => setTimeout(resolve, 1500));
                                    toast.success("Image uploaded!");
                                    // Return a placeholder image URL
                                    return URL.createObjectURL(file);
                                }
                            }}
                            dragDropEnabled
                        />
                    </div>

                    {/* Description Editor */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Description Editor</h3>
                        <TextEditor
                            preset="description"
                            placeholder="Enter product description..."
                            showWordCount
                            validation={{ minLength: 50 }}
                        />
                    </div>
                </div>
            </Card>

            {/* Image Upload */}
            <Card title="Image Upload" subtitle="Drag & drop image upload with multiple modes and features">
                <div className="space-y-8">
                    {/* Basic Upload */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Basic Single Image Upload</h3>
                        <ImageUpload
                            label="Upload Image"
                            helperText="Accepts JPG, PNG, WebP up to 5MB"
                            multiple={false}
                            accept={['image/jpeg', 'image/png', 'image/webp']}
                            maxSize={5 * 1024 * 1024}
                            onUpload={mockUpload}
                            onChange={(images) => console.log('Single upload:', images)}
                        />
                    </div>

                    {/* Multiple Upload */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Multiple Image Upload</h3>
                        <ImageUpload
                            label="Upload Multiple Images"
                            multiple={true}
                            maxFiles={5}
                            accept={['image/jpeg', 'image/png', 'image/webp']}
                            maxSize={5 * 1024 * 1024}
                            onUpload={mockUpload}
                            value={galleryImages}
                            onChange={setGalleryImages}
                            enableReorder
                            showFileName
                            showFileSize
                            gridColumns={3}
                        />
                    </div>

                    {/* Preset: Profile Picture */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Profile Picture Upload (Preset)</h3>
                        <ImageUpload
                            preset="profile"
                            label="Profile Picture"
                            helperText="Square image recommended (1:1 ratio)"
                            onUpload={mockUpload}
                            value={profileImage}
                            onChange={setProfileImage}
                        />
                    </div>

                    {/* Preset: Gallery */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Gallery Upload (Preset)</h3>
                        <ImageUpload
                            preset="gallery"
                            label="Photo Gallery"
                            helperText="Upload up to 20 images"
                            onUpload={mockUpload}
                            onSelect={(files) => toast.info(`Selected ${files.length} files`)}
                            onSuccess={(id, url) => toast.success(`Image uploaded: ${url}`)}
                            onError={(id, error) => toast.error(`Upload failed: ${error}`)}
                        />
                    </div>

                    {/* Preset: Banner */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Banner Upload (Preset)</h3>
                        <ImageUpload
                            preset="banner"
                            label="Banner Image"
                            helperText="Recommended size: 1920x1080 (16:9 ratio)"
                            onUpload={mockUpload}
                            value={bannerImage}
                            onChange={setBannerImage}
                        />
                    </div>

                    {/* Preset: Product Images */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Product Images (Preset)</h3>
                        <ImageUpload
                            preset="product"
                            label="Product Images"
                            helperText="Upload up to 10 product images"
                            onUpload={mockUpload}
                            value={productImages}
                            onChange={setProductImages}
                            enableReorder
                            onReorder={(images) => toast.info('Images reordered')}
                        />
                    </div>

                    {/* Manual Upload Mode */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Manual Upload Mode</h3>
                        <p className="text-sm text-gray-600">Select files first, then click "Upload All" button</p>
                        <ImageUpload
                            label="Select Files"
                            multiple={true}
                            maxFiles={3}
                            uploadMode="manual"
                            onUpload={mockUpload}
                            onUploadStart={(file) => toast.info(`Uploading ${file.name}...`)}
                            onSuccess={(id, url) => toast.success('Upload complete!')}
                        />
                    </div>

                    {/* With Camera Support (Mobile) */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">With Camera Capture</h3>
                        <ImageUpload
                            label="Take Photo or Upload"
                            enableCamera={true}
                            onUpload={mockUpload}
                            helperText="Use camera button to take a photo"
                        />
                    </div>

                    {/* With Validation */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">With Dimension Validation</h3>
                        <ImageUpload
                            label="Upload (Min 800x600)"
                            imageDimensions={{
                                minWidth: 800,
                                minHeight: 600,
                            }}
                            validationMode="hard"
                            onUpload={mockUpload}
                            helperText="Image must be at least 800x600 pixels"
                        />
                    </div>

                    {/* Paste Support */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Paste Image Support</h3>
                        <p className="text-sm text-gray-600">Copy an image and paste it (Ctrl+V / Cmd+V)</p>
                        <ImageUpload
                            label="Paste Image Here"
                            enablePaste={true}
                            onUpload={mockUpload}
                            placeholder="Click or paste image from clipboard"
                        />
                    </div>

                    {/* Small Preview Size */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Different Preview Sizes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Small</p>
                                <ImageUpload
                                    previewSize="sm"
                                    multiple={true}
                                    maxFiles={3}
                                    onUpload={mockUpload}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Medium (Default)</p>
                                <ImageUpload
                                    previewSize="md"
                                    multiple={true}
                                    maxFiles={3}
                                    onUpload={mockUpload}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Large</p>
                                <ImageUpload
                                    previewSize="lg"
                                    multiple={true}
                                    maxFiles={3}
                                    onUpload={mockUpload}
                                />
                            </div>
                        </div>
                    </div>

                    {/* States */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Component States</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Disabled</label>
                                <ImageUpload
                                    disabled
                                    placeholder="Upload disabled"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Read Only</label>
                                <ImageUpload
                                    readOnly
                                    value={[{
                                        id: '1',
                                        file: new File([], 'readonly.jpg'),
                                        preview: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                                        name: 'readonly.jpg',
                                        size: 102400,
                                        type: 'image/jpeg',
                                        progress: 100,
                                        status: 'success'
                                    }]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">With Error</label>
                                <ImageUpload
                                    error="Upload failed. Please try again."
                                    placeholder="Upload with error state"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Loading</label>
                                <ImageUpload
                                    loading
                                    placeholder="Loading state"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Custom Validator */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Custom Validation</h3>
                        <ImageUpload
                            label="Custom Validator (File name must contain 'product')"
                            customValidator={async (file) => {
                                if (!file.name.toLowerCase().includes('product')) {
                                    return 'File name must contain "product"';
                                }
                                return null;
                            }}
                            validationMode="soft"
                            onUpload={mockUpload}
                            helperText="Try uploading files with different names"
                        />
                    </div>

                    {/* No Drag & Drop */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Click Only (No Drag & Drop)</h3>
                        <ImageUpload
                            label="Click to Upload"
                            enableDragDrop={false}
                            onUpload={mockUpload}
                            placeholder="Click to select image"
                        />
                    </div>

                    {/* Grid Columns */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Different Grid Layouts</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">2 Columns</p>
                                <ImageUpload
                                    multiple={true}
                                    maxFiles={4}
                                    gridColumns={2}
                                    onUpload={mockUpload}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">6 Columns</p>
                                <ImageUpload
                                    multiple={true}
                                    maxFiles={6}
                                    gridColumns={6}
                                    previewSize="sm"
                                    onUpload={mockUpload}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Event Callbacks */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700">Event Callbacks</h3>
                        <ImageUpload
                            label="Upload with Events"
                            multiple={true}
                            maxFiles={3}
                            onUpload={mockUpload}
                            onSelect={(files) => {
                                toast.info(`Selected: ${files.map(f => f.name).join(', ')}`);
                            }}
                            onUploadStart={(file) => {
                                toast.info(`Uploading: ${file.name}`);
                            }}
                            onSuccess={(id, url) => {
                                toast.success(`Success! URL: ${url.substring(0, 50)}...`);
                            }}
                            onError={(id, error) => {
                                toast.error(`Error: ${error}`);
                            }}
                            onRemove={(id) => {
                                toast.info('Image removed');
                            }}
                            onReorder={(images) => {
                                toast.info(`Reordered: ${images.length} images`);
                            }}
                            enableReorder
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}

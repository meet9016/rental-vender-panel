// app/components-demo/page.tsx
"use client";

import { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import {
    Button,
    Input,
    Textarea,
    Select,
    Modal,
    useToast,
    Loader,
    Checkbox,
    Radio,
    RadioGroup,
    Table,
    Badge,
    Card,
} from "@/components/common/ui";
import type { SelectOption } from "@/components/common/ui";

// Sample data for table
const sampleData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "inactive" },
];

export default function EcommercePage() {
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectValue, setSelectValue] = useState("");
    const [radioValue, setRadioValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const selectOptions: SelectOption[] = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ];

    const radioOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
    ];

    const tableColumns = [
        { key: "name", header: "Name", width: "25%" },
        { key: "email", header: "Email", width: "30%" },
        { key: "role", header: "Role", width: "20%" },
        {
            key: "status",
            header: "Status",
            width: "25%",
            render: (item: typeof sampleData[0]) => (
                <Badge variant={item.status === "active" ? "success" : "secondary"}>
                    {item.status}
                </Badge>
            ),
        },
    ];

    const handleLoadingDemo = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 3000);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Components Demo</h1>

            {/* Buttons */}
            <Card title="Buttons" subtitle="Different button variants and sizes">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="danger">Danger</Button>
                        <Button variant="success">Success</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button isLoading>Loading</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                </div>
            </Card>

            {/* Inputs */}
            <Card title="Inputs" subtitle="Text inputs with different configurations">
                <div className="space-y-4">
                    <Input label="Name" placeholder="Enter your name" />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        helperText="We'll never share your email"
                    />
                    <Input
                        label="Search"
                        placeholder="Search..."
                        icon={<FaSearch />}
                        iconPosition="left"
                    />
                    <Input
                        label="Username"
                        placeholder="Enter username"
                        icon={<FaUser />}
                        iconPosition="right"
                        error="Username is already taken"
                    />
                </div>
            </Card>

            {/* Textarea */}
            <Card title="Textarea" subtitle="Multi-line text input">
                <Textarea
                    label="Description"
                    placeholder="Enter description..."
                    helperText="Maximum 500 characters"
                    rows={5}
                />
            </Card>

            {/* Select */}
            <Card title="Select" subtitle="Custom dropdown select">
                <div className="space-y-4">
                    <Select
                        label="Choose an option"
                        options={selectOptions}
                        value={selectValue}
                        onChange={setSelectValue}
                        placeholder="Select..."
                    />
                    <Select
                        label="Disabled Select"
                        options={selectOptions}
                        value=""
                        onChange={() => { }}
                        disabled
                    />
                </div>
            </Card>

            {/* Checkboxes & Radio */}
            <Card title="Checkboxes & Radio Buttons" subtitle="Selection controls">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Checkboxes</h4>
                        <div className="space-y-2">
                            <Checkbox label="Remember me" />
                            <Checkbox label="Subscribe to newsletter" />
                            <Checkbox label="Agree to terms" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Radio Buttons</h4>
                        <div className="space-y-2">
                            <Radio name="payment" label="Credit Card" value="credit" />
                            <Radio name="payment" label="PayPal" value="paypal" />
                            <Radio name="payment" label="Bank Transfer" value="bank" />
                        </div>
                    </div>

                    <div>
                        <RadioGroup
                            name="gender"
                            label="Gender"
                            options={radioOptions}
                            value={radioValue}
                            onChange={setRadioValue}
                            direction="horizontal"
                        />
                    </div>
                </div>
            </Card>

            {/* Modal */}
            <Card title="Modal" subtitle="Dialog component">
                <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Sample Modal"
                    footer={
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                        </div>
                    }
                >
                    <p className="text-gray-700">
                        This is a sample modal content. You can put any content here including forms,
                        images, or other components.
                    </p>
                </Modal>
            </Card>

            {/* Toast */}
            <Card title="Toast Notifications" subtitle="Temporary notification messages">
                <div className="flex flex-wrap gap-3">
                    <Button onClick={() => showToast("success", "Action completed successfully!")}>
                        Success Toast
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => showToast("error", "Something went wrong!")}
                    >
                        Error Toast
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => showToast("info", "Here's some information")}
                    >
                        Info Toast
                    </Button>
                    <Button onClick={() => showToast("warning", "Please be careful!")}>
                        Warning Toast
                    </Button>
                </div>
            </Card>

            {/* Loader */}
            <Card title="Loaders" subtitle="Loading indicators">
                <div className="space-y-6">
                    <div className="flex gap-6 items-center">
                        <Loader size="sm" />
                        <Loader size="md" />
                        <Loader size="lg" />
                    </div>
                    <Loader text="Loading data..." />
                    <Button onClick={handleLoadingDemo}>Show Fullscreen Loader</Button>
                    {isLoading && <Loader fullScreen text="Loading..." />}
                </div>
            </Card>

            {/* Badges */}
            <Card title="Badges" subtitle="Status indicators">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="danger">Danger</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="info">Info</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Badge size="sm">Small</Badge>
                        <Badge size="md">Medium</Badge>
                        <Badge size="lg">Large</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Badge rounded>Rounded</Badge>
                        <Badge variant="success" rounded>Active</Badge>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card title="Table" subtitle="Data table with custom rendering">
                <Table
                    data={sampleData}
                    columns={tableColumns}
                    striped
                    hoverable
                />
            </Card>

            {/* Cards */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Card Variants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="Simple Card" shadow="sm">
                        <p className="text-gray-600">This is a simple card with minimal shadow.</p>
                    </Card>

                    <Card title="Hoverable Card" hoverable>
                        <p className="text-gray-600">Hover over this card to see the effect.</p>
                    </Card>

                    <Card
                        title="Card with Footer"
                        footer={
                            <Button fullWidth variant="primary">
                                Take Action
                            </Button>
                        }
                    >
                        <p className="text-gray-600">This card has a footer section.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
'use client';

import React, { useState } from 'react';
import Input from '@/components/common/ui/Input';
import Select, { type SelectOption } from '@/components/common/ui/Select';
import Button from '@/components/common/ui/Button';
import TextEditor from '@/components/common/ui/TextEditor';
import ImageUpload, { type UploadedImage } from '@/components/common/ui/ImageUpload';
import { Plus, X } from 'lucide-react';

/* ================= TYPES ================= */

interface Feature {
    id: string;
    key: string;
    value: string;
}

interface MonthlyPackage {
    id: string;
    duration: string;
    price: string;
    cancelPrice: string;
}

interface SellingPackage {
    id: string;
    quantity: string;
    price: string;
}

interface FormData {
    type: string;
    name: string;

    sellingPrice: string;
    sellingCancelPrice: string;
    sellingPackages: SellingPackage[];

    dayPrice: string;
    dayCancelPrice: string;
    monthlyPackages: MonthlyPackage[];

    description: string;
    category: string;
    subCategory: string;

    mainImage: UploadedImage[];
    subImages: UploadedImage[];

    features: Feature[];
}

/* ================= OPTIONS ================= */

const typeOptions: SelectOption[] = [
    { value: 'rent', label: 'Rent' },
    { value: 'sell', label: 'Sell' },
];

const monthOptions: SelectOption[] = [
    { value: '1', label: '1 Month' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
];

const quantityOptions: SelectOption[] = [
    { value: '2', label: '2 Units' },
    { value: '5', label: '5 Units' },
    { value: '10', label: '10 Units' },
];

/* ================= PAGE ================= */

export default function AddProductPage() {
    const [data, setData] = useState<FormData>({
        type: '',
        name: '',

        sellingPrice: '',
        sellingCancelPrice: '',
        sellingPackages: [],

        dayPrice: '',
        dayCancelPrice: '',
        monthlyPackages: [],

        description: '',
        category: '',
        subCategory: '',

        mainImage: [],
        subImages: [],

        features: [],
    });

    const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
        setData((p) => ({ ...p, [key]: value }));

    const isRent = data.type === 'rent';
    const isSell = data.type === 'sell';

    /* ================= HELPERS ================= */

    const addFeature = () =>
        setData((p) => ({
            ...p,
            features: [...p.features, { id: crypto.randomUUID(), key: '', value: '' }],
        }));

    const addSellingPackage = () =>
        setData((p) => ({
            ...p,
            sellingPackages: [...p.sellingPackages, { id: crypto.randomUUID(), quantity: '', price: '' }],
        }));

    const addMonthlyPackage = () =>
        setData((p) => ({
            ...p,
            monthlyPackages: [...p.monthlyPackages, { id: crypto.randomUUID(), duration: '', price: '', cancelPrice: '' }],
        }));

    /* ================= SUBMIT ================= */

    const handleSubmit = () => {
        console.log('📦 PRODUCT DATA', data);
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-[#F7F8FA] py-10">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Fill all the details to list your product
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline">Save Draft</Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Add Product
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-10">
                    {/* LEFT COLUMN */}
                    <div className="col-span-8 space-y-10">
                        {/* BASIC INFO */}
                        <Card title="Basic Information">
                            <div className="space-y-6">
                                <Select label="Listing Type" options={typeOptions} value={data.type} onChange={(v) => update('type', v)} />
                                <Input label="Item / Property Name" value={data.name} onChange={(e) => update('name', e.target.value)} />
                                <TextEditor value={data.description} onChange={(v) => update('description', v)} minHeight={160} />
                            </div>
                        </Card>

                        {/* PRICING */}
                        <Card
                            title="Pricing"
                            action={
                                isRent ? (
                                    <button onClick={addMonthlyPackage} className="text-sm font-medium text-blue-600">
                                        + Add Monthly Package
                                    </button>
                                ) : isSell ? (
                                    <button onClick={addSellingPackage} className="text-sm font-medium text-blue-600">
                                        + Add Selling Package
                                    </button>
                                ) : null
                            }
                        >
                            {!data.type && (
                                <EmptyState text="Select Rent or Sell to configure pricing" />
                            )}

                            {isSell && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <Input label="Base Price" value={data.sellingPrice} />
                                        <Input label="Cancel Price" value={data.sellingCancelPrice} />
                                    </div>
                                </div>
                            )}

                            {isRent && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="section-title">Daily Pricing</h3>
                                        <div className="grid grid-cols-2 gap-6 mt-4">
                                            <Input label="Day Price" value={data.dayPrice} />
                                            <Input label="Day Cancel Price" value={data.dayCancelPrice} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* FEATURES */}
                        <Card
                            title="Key Features"
                            action={
                                <button onClick={addFeature} className="text-sm font-medium text-blue-600">
                                    + Add Feature
                                </button>
                            }
                        >
                            {data.features.length === 0 ? (
                                <EmptyState text="Add features like Brand, Model, Condition, Warranty" />
                            ) : (
                                <div className="space-y-4">
                                    {data.features.map((f) => (
                                        <div key={f.id} className="grid grid-cols-12 gap-4">
                                            <div className="col-span-5">
                                                <Input placeholder="Feature" value={f.key} />
                                            </div>
                                            <div className="col-span-6">
                                                <Input placeholder="Value" value={f.value} />
                                            </div>
                                            <button className="col-span-1 text-red-500">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-span-4 space-y-10">
                        <Card title="Images">
                            <div className="space-y-6">
                                <ImageUpload label="Main Image" value={data.mainImage} />
                                <ImageUpload label="Gallery Images" value={data.subImages} multiple />
                            </div>
                        </Card>

                        <Card title="Category">
                            <div className="space-y-6">
                                <Select label="Category" value={data.category} onChange={(v) => update('category', v)} options={[]} />
                                <Select label="Sub Category" value={data.subCategory} onChange={(v) => update('subCategory', v)} options={[]} />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= UI HELPERS ================= */

const Card = ({
    title,
    children,
    action,
}: {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}) => (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            {action}
        </div>
        {children}
    </div>
);

const EmptyState = ({ text }: { text: string }) => (
    <div className="py-10 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl">
        {text}
    </div>
);

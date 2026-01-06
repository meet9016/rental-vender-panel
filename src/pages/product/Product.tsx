'use client';
import React, { useState } from 'react';
import Button from '@/components/common/ui/Button';
import Input from '@/components/common/ui/Input';
import Select from '@/components/common/ui/Select';
import TextEditor from '@/components/common/ui/TextEditor';
import ImageUpload from '@/components/common/ui/ImageUpload';
import type { UploadedImage } from '@/components/common/ui/ImageUpload';
import type { SelectOption } from '@/components/common/ui/Select';
import { Plus, X, Package, DollarSign, Image as ImageIcon, FileText, Tag } from 'lucide-react';

interface KeyFeature {
  id: string;
  key: string;
  value: string;
}

interface ProductFormData {
  type: string;
  name: string;
  dayPrice: string;
  dayCancelPrice: string;
  monthPrice: string;
  monthCancelPrice: string;
  mainImage: UploadedImage[];
  subImages: UploadedImage[];
  description: string;
  category: string;
  subCategory: string;
  keyFeatures: KeyFeature[];
}

const typeOptions: SelectOption[] = [
  { value: 'rent', label: 'Rent' },
  { value: 'sell', label: 'Sell' },
];

const categoryOptions: SelectOption[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'properties', label: 'Properties' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'tools', label: 'Tools & Equipment' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'sports', label: 'Sports Equipment' },
];

const subCategoryMap: { [key: string]: SelectOption[] } = {
  electronics: [
    { value: 'laptops', label: 'Laptops' },
    { value: 'phones', label: 'Phones' },
    { value: 'cameras', label: 'Cameras' },
    { value: 'audio', label: 'Audio Equipment' },
    { value: 'gaming', label: 'Gaming Consoles' },
  ],
  furniture: [
    { value: 'chairs', label: 'Chairs' },
    { value: 'tables', label: 'Tables' },
    { value: 'beds', label: 'Beds' },
    { value: 'sofas', label: 'Sofas' },
    { value: 'wardrobes', label: 'Wardrobes' },
  ],
  vehicles: [
    { value: 'cars', label: 'Cars' },
    { value: 'bikes', label: 'Bikes' },
    { value: 'scooters', label: 'Scooters' },
    { value: 'bicycles', label: 'Bicycles' },
  ],
  properties: [
    { value: 'apartments', label: 'Apartments' },
    { value: 'houses', label: 'Houses' },
    { value: 'offices', label: 'Offices' },
    { value: 'shops', label: 'Shops' },
    { value: 'warehouses', label: 'Warehouses' },
  ],
  appliances: [
    { value: 'refrigerators', label: 'Refrigerators' },
    { value: 'washing-machines', label: 'Washing Machines' },
    { value: 'air-conditioners', label: 'Air Conditioners' },
    { value: 'microwaves', label: 'Microwaves' },
  ],
  tools: [
    { value: 'power-tools', label: 'Power Tools' },
    { value: 'hand-tools', label: 'Hand Tools' },
    { value: 'garden-equipment', label: 'Garden Equipment' },
    { value: 'construction', label: 'Construction Equipment' },
  ],
  clothing: [
    { value: 'mens', label: "Men's Wear" },
    { value: 'womens', label: "Women's Wear" },
    { value: 'kids', label: 'Kids Wear' },
    { value: 'accessories', label: 'Accessories' },
  ],
  sports: [
    { value: 'gym-equipment', label: 'Gym Equipment' },
    { value: 'outdoor', label: 'Outdoor Sports' },
    { value: 'indoor', label: 'Indoor Sports' },
    { value: 'cycling', label: 'Cycling' },
  ],
};

export default function AddProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    type: '',
    name: '',
    dayPrice: '',
    dayCancelPrice: '',
    monthPrice: '',
    monthCancelPrice: '',
    mainImage: [],
    subImages: [],
    description: '',
    category: '',
    subCategory: '',
    keyFeatures: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subCategoryOptions = formData.category
    ? subCategoryMap[formData.category] || []
    : [];

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      subCategory: '',
    }));

    if (errors.category) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  // Key Features Management
  const addKeyFeature = () => {
    const newFeature: KeyFeature = {
      id: `feature-${Date.now()}`,
      key: '',
      value: '',
    };
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, newFeature],
    }));
  };

  const updateKeyFeature = (id: string, field: 'key' | 'value', value: string) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      ),
    }));
  };

  const removeKeyFeature = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((feature) => feature.id !== id),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subCategory) newErrors.subCategory = 'Sub Category is required';

    if (formData.type === 'rent') {
      if (!formData.dayPrice) newErrors.dayPrice = 'Day price is required';
      if (!formData.monthPrice) newErrors.monthPrice = 'Month price is required';
    } else if (formData.type === 'sell') {
      if (!formData.dayPrice) newErrors.dayPrice = 'Price is required';
    }

    if (formData.mainImage.length === 0) {
      newErrors.mainImage = 'Main image is required';
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('=== RENTAL INDIA PRODUCT DATA ===');
      console.log('Type:', formData.type);
      console.log('Name:', formData.name);
      console.log('Category:', formData.category);
      console.log('Sub Category:', formData.subCategory);
      console.log('Pricing:', {
        dayPrice: formData.dayPrice,
        dayCancelPrice: formData.dayCancelPrice,
        monthPrice: formData.monthPrice,
        monthCancelPrice: formData.monthCancelPrice,
      });
      console.log('Main Image:', formData.mainImage);
      console.log('Sub Images:', formData.subImages);
      console.log('Description:', formData.description);
      console.log('Key Features:', formData.keyFeatures);
      console.log('================================');

      alert('Product listed successfully! Check console for data.');

      setFormData({
        type: '',
        name: '',
        dayPrice: '',
        dayCancelPrice: '',
        monthPrice: '',
        monthCancelPrice: '',
        mainImage: [],
        subImages: [],
        description: '',
        category: '',
        subCategory: '',
        keyFeatures: [],
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to list product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setFormData({
        type: '',
        name: '',
        dayPrice: '',
        dayCancelPrice: '',
        monthPrice: '',
        monthCancelPrice: '',
        mainImage: [],
        subImages: [],
        description: '',
        category: '',
        subCategory: '',
        keyFeatures: [],
      });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Product</h1>
          <p className="text-lg text-gray-600">Rental India - Vendor Portal</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Quick & Easy
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Professional
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Secure
            </span>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Progress Steps */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold shadow-lg">1</div>
                <span className="text-white font-medium hidden sm:inline">Basic Info</span>
              </div>
              <div className="flex-1 h-1 bg-blue-400 mx-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <span className="text-blue-100 font-medium hidden sm:inline">Pricing</span>
              </div>
              <div className="flex-1 h-1 bg-blue-400 mx-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <span className="text-blue-100 font-medium hidden sm:inline">Details</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 lg:p-12 space-y-10">
            {/* Section 1: Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-500">Tell us about your product</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Select
                  label="Listing Type"
                  options={typeOptions}
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value)}
                  placeholder="Select type (Rent/Sell)"
                  required
                  error={!!errors.type}
                  errorMessage={errors.type}
                />

                <Input
                  label="Product/Property Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., iPhone 15 Pro Max, Royal Enfield Classic"
                  required
                  error={!!errors.name}
                  errorMessage={errors.name}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={handleCategoryChange}
                  placeholder="Select category"
                  required
                  error={!!errors.category}
                  errorMessage={errors.category}
                />

                <Select
                  label="Sub Category"
                  options={subCategoryOptions}
                  value={formData.subCategory}
                  onChange={(value) => handleInputChange('subCategory', value)}
                  placeholder="Select sub category"
                  required
                  disabled={!formData.category}
                  error={!!errors.subCategory}
                  errorMessage={errors.subCategory}
                  helperText={!formData.category ? 'Please select a category first' : undefined}
                />
              </div>
            </div>

            {/* Section 2: Pricing */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pricing Details</h2>
                  <p className="text-sm text-gray-500">Set your competitive pricing</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 lg:p-8 border border-gray-200">
                {formData.type === 'rent' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Input
                          label="Day Rental Price"
                          type="number"
                          value={formData.dayPrice}
                          onChange={(e) => handleInputChange('dayPrice', e.target.value)}
                          placeholder="Enter daily rental price"
                          required
                          error={!!errors.dayPrice}
                          errorMessage={errors.dayPrice}
                          leftIcon={<span className="text-gray-500">₹</span>}
                        />
                        <p className="text-xs text-gray-500 ml-1">Price per day for renting</p>
                      </div>

                      <div className="space-y-2">
                        <Input
                          label="Day Cancellation Fee"
                          type="number"
                          value={formData.dayCancelPrice}
                          onChange={(e) => handleInputChange('dayCancelPrice', e.target.value)}
                          placeholder="Enter cancellation fee"
                          leftIcon={<span className="text-gray-500">₹</span>}
                        />
                        <p className="text-xs text-gray-500 ml-1">Fee charged if cancelled (optional)</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Input
                            label="Monthly Rental Price"
                            type="number"
                            value={formData.monthPrice}
                            onChange={(e) => handleInputChange('monthPrice', e.target.value)}
                            placeholder="Enter monthly rental price"
                            required
                            error={!!errors.monthPrice}
                            errorMessage={errors.monthPrice}
                            leftIcon={<span className="text-gray-500">₹</span>}
                          />
                          <p className="text-xs text-gray-500 ml-1">Price per month for renting</p>
                        </div>

                        <div className="space-y-2">
                          <Input
                            label="Month Cancellation Fee"
                            type="number"
                            value={formData.monthCancelPrice}
                            onChange={(e) => handleInputChange('monthCancelPrice', e.target.value)}
                            placeholder="Enter cancellation fee"
                            leftIcon={<span className="text-gray-500">₹</span>}
                          />
                          <p className="text-xs text-gray-500 ml-1">Fee charged if cancelled (optional)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : formData.type === 'sell' ? (
                  <div className="max-w-md">
                    <Input
                      label="Selling Price"
                      type="number"
                      value={formData.dayPrice}
                      onChange={(e) => handleInputChange('dayPrice', e.target.value)}
                      placeholder="Enter your selling price"
                      required
                      error={!!errors.dayPrice}
                      errorMessage={errors.dayPrice}
                      leftIcon={<span className="text-gray-500">₹</span>}
                    />
                    <p className="text-xs text-gray-500 ml-1 mt-2">Set a competitive price for your product</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Please select a listing type above to configure pricing</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Images */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
                  <p className="text-sm text-gray-500">High-quality images attract more customers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ImageUpload
                    label="Main Product Image"
                    value={formData.mainImage}
                    onChange={(images) => handleInputChange('mainImage', images)}
                    multiple={false}
                    maxFiles={1}
                    preset="product"
                    error={errors.mainImage}
                    helperText="Upload a clear main image (Max 5MB, JPG/PNG)"
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Additional Images"
                    value={formData.subImages}
                    onChange={(images) => handleInputChange('subImages', images)}
                    multiple={true}
                    maxFiles={5}
                    preset="gallery"
                    helperText="Upload up to 5 additional images (Max 5MB each)"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Product Description</h2>
                  <p className="text-sm text-gray-500">Provide detailed information about your product</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <TextEditor
                  mode="rich"
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Describe your product in detail: condition, features, usage, benefits..."
                  minHeight={250}
                  preset="description"
                  error={errors.description}
                />
              </div>
            </div>

            {/* Section 5: Key Features */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Tag className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Key Features & Specifications</h2>
                    <p className="text-sm text-gray-500">Add important specifications and features</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addKeyFeature}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Feature
                </Button>
              </div>

              {formData.keyFeatures.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                  <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No features added yet</h3>
                  <p className="text-gray-500 mb-6">Add specifications like Brand, Model, Color, Size, Condition, etc.</p>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={addKeyFeature}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Your First Feature
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.keyFeatures.map((feature, index) => (
                    <div
                      key={feature.id}
                      className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Feature Name"
                            value={feature.key}
                            onChange={(e) =>
                              updateKeyFeature(feature.id, 'key', e.target.value)
                            }
                            placeholder="e.g., Brand, Model, Color, Size"
                            size="sm"
                          />
                          <Input
                            label="Feature Value"
                            value={feature.value}
                            onChange={(e) =>
                              updateKeyFeature(feature.id, 'value', e.target.value)
                            }
                            placeholder="e.g., Samsung, A52, Blue, XL"
                            size="sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeKeyFeature(feature.id)}
                          className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                          aria-label="Remove feature"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t-2 border-gray-200">
              <p className="text-sm text-gray-500 order-2 sm:order-1">
                All fields marked with <span className="text-red-500">*</span> are required
              </p>
              <div className="flex gap-4 order-1 sm:order-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  loadingText="Listing Product..."
                  size="lg"
                  className="min-w-[200px]"
                >
                  List Product
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By listing a product, you agree to Rental India's{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Vendor Guidelines
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-2">© 2024 Rental India. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
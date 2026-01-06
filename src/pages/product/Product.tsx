'use client';

import React, { useState } from 'react';
import { Plus, Search, MoreVertical, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/ui/Button';
import Input from '@/components/common/ui/Input';

interface Product {
  id: number;
  name: string;
  type: 'rent' | 'sell';
  category: string;
  subCategory: string;
  date: string;
  image: string;
  price: number;
  views: number;
  click: string;
  quantity: number;
  revenue: number;
  status: 'Active' | 'Inactive' | 'Draft';
  description: string;
}

export default function ProductListPage() {
  const router = useRouter();

  const [products] = useState<Product[]>([
    {
      id: 1,
      name: 'Long Sleeve Plaid Flannel',
      type: 'sell',
      category: 'Clothing',
      subCategory: 'Shirts',
      date: '12 Apr',
      image: '🧥',
      price: 48.00,
      views: 12700,
      click: '85%',
      quantity: 8650,
      revenue: 35750,
      status: 'Active',
      description: 'Premium quality plaid flannel shirt',
    },
    {
      id: 2,
      name: 'Long Sleeve Oversized',
      type: 'sell',
      category: 'Clothing',
      subCategory: 'Shirts',
      date: '12 Apr',
      image: '👕',
      price: 34.00,
      views: 11500,
      click: '70%',
      quantity: 6500,
      revenue: 24800,
      status: 'Active',
      description: 'Comfortable oversized denim shirt',
    },
    {
      id: 3,
      name: 'Gray Version Long Sleeve',
      type: 'rent',
      category: 'Clothing',
      subCategory: 'Formal',
      date: '12 Apr',
      image: '👔',
      price: 42.00,
      views: 9350,
      click: '65%',
      quantity: 4100,
      revenue: 20900,
      status: 'Active',
      description: 'Elegant gray formal shirt',
    },
    {
      id: 4,
      name: 'Charcoal Classic Sleeve',
      type: 'sell',
      category: 'Clothing',
      subCategory: 'Casual',
      date: '12 Apr',
      image: '🎽',
      price: 38.00,
      views: 8500,
      click: '60%',
      quantity: 3800,
      revenue: 14820,
      status: 'Active',
      description: 'Classic crew neck shirt in charcoal',
    },
    {
      id: 5,
      name: 'Rustic Olive Classic Green',
      type: 'rent',
      category: 'Clothing',
      subCategory: 'Casual',
      date: '12 Apr',
      image: '👚',
      price: 36.00,
      views: 7900,
      click: '58%',
      quantity: 3600,
      revenue: 12960,
      status: 'Active',
      description: 'Casual henley shirt in olive green',
    },
    {
      id: 6,
      name: 'Midnight Standard Black',
      type: 'sell',
      category: 'Clothing',
      subCategory: 'Pants',
      date: '12 Apr',
      image: '👖',
      price: 49.00,
      views: 10200,
      click: '62%',
      quantity: 4000,
      revenue: 19600,
      status: 'Active',
      description: 'Slim fit joggers in midnight black',
    },
    {
      id: 7,
      name: 'Rich Forest Green Wool',
      type: 'rent',
      category: 'Clothing',
      subCategory: 'Outerwear',
      date: '12 Apr',
      image: '🧶',
      price: 42.00,
      views: 9300,
      click: '64%',
      quantity: 3900,
      revenue: 16380,
      status: 'Active',
      description: 'Quarter zip pullover in forest green',
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleSelectAll = (): void => {
    if (selectedItems.size === products.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(products.map(p => p.id)));
    }
  };

  const toggleSelect = (id: number): void => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Product Lists</h1>

            <div className="flex gap-3">
              <div className="relative">
                <Input
                  placeholder="Type Product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
              <Button
                variant="primary"
                onClick={() => router.push('/products/add-product')}
              >
                <Plus size={18} />
                Add Products
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 w-12">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">View</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Click</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Quantity</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Revenue</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="py-4 px-6 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedItems.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl">
                            {product.image}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.subCategory} • {product.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.type === 'rent'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                          }`}>
                          {product.type === 'rent' ? 'Rent' : 'Sell'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {product.views.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        {product.click}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {product.quantity.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                        ${product.revenue.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${product.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : product.status === 'Inactive'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'Active'
                              ? 'bg-green-600'
                              : product.status === 'Inactive'
                                ? 'bg-red-600'
                                : 'bg-gray-600'
                            }`}></span>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {filteredProducts.length} Products
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page {currentPage}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <ChevronRight size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
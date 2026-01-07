'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/ui/Button';
import Input from '@/components/common/ui/Input';
import StatCard from '@/components/common/ui/StatCard';
import Pagination from '@/components/common/ui/Pagination';

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface Product {
  id: string;
  name: string;
  type: 'rent' | 'sell';
  category: string;
  subCategory: string;
  createdDate: string;
  image: string;
  sellingPrice?: number;
  dayPrice?: number;
  stock: number;
  status: 'Published' | 'Draft List' | 'Inactive' | 'Out of Stock';
  description: string;
}

interface StatsData {
  totalMenu: number;
  itemSales: number;
  stockItems: number;
  outOfStock: number;
}

export default function ProductListPage() {
  const router = useRouter();
  const gridRef = useRef<AgGridReact>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);

  // Sample data
  const [products] = useState<Product[]>([
    {
      id: '#CFFE49283',
      name: 'Choco Choco',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Americano',
      createdDate: '14th 2025, 23:59',
      image: '☕',
      sellingPrice: 2.50,
      stock: 1000,
      status: 'Published',
      description: 'Rich chocolate cappuccino',
    },
    {
      id: '#CFFE84701',
      name: 'Broccoli Cinno',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Cappuccino',
      createdDate: '14th 2025, 21:19',
      image: '🥦',
      sellingPrice: 2.50,
      stock: 969,
      status: 'Draft List',
      description: 'Unique broccoli flavored coffee',
    },
    {
      id: '#CFFE39782',
      name: 'Bayem Cinno',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Cappuccino',
      createdDate: '17th 2025, 23:59',
      image: '🌿',
      sellingPrice: 2.50,
      stock: 800,
      status: 'Published',
      description: 'Spinach infused cappuccino',
    },
    {
      id: '#CFFE650384',
      name: 'Vitamin C Latte',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Latte',
      createdDate: '17th 2025, 07:00',
      image: '🍊',
      sellingPrice: 2.50,
      stock: 772,
      status: 'Published',
      description: 'Citrus enriched latte',
    },
    {
      id: '#CFFE204971',
      name: 'Balado Chili',
      type: 'rent',
      category: 'Coffee',
      subCategory: 'Espresso',
      createdDate: '19th 2025, 12:59',
      image: '🌶️',
      dayPrice: 2.50,
      stock: 700,
      status: 'Inactive',
      description: 'Spicy espresso blend',
    },
    {
      id: '#CFFE738820',
      name: 'Rumpot Laut Latte',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Latte',
      createdDate: '19th 2025, 18:01',
      image: '🌊',
      sellingPrice: 2.50,
      stock: 640,
      status: 'Published',
      description: 'Sea-inspired latte',
    },
    {
      id: '#CFFE416985',
      name: 'Jeruk Bali Latte',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Latte',
      createdDate: '23rd 2025, 23:59',
      image: '🍋',
      sellingPrice: 2.50,
      stock: 560,
      status: 'Out of Stock',
      description: 'Pomelo citrus latte',
    },
    {
      id: '#CFFE921047',
      name: 'Sweet Salty',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Espresso',
      createdDate: '25th 2025, 23:59',
      image: '🧂',
      sellingPrice: 2.50,
      stock: 999,
      status: 'Out of Stock',
      description: 'Sweet and salty espresso',
    },
    {
      id: '#CFFE583190',
      name: 'Coconut Latte',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Latte',
      createdDate: '5 May 2025, 23:59',
      image: '🥥',
      sellingPrice: 2.50,
      stock: 240,
      status: 'Published',
      description: 'Creamy coconut latte',
    },
    {
      id: '#CFFE926438',
      name: 'Coconut Elder',
      type: 'sell',
      category: 'Coffee',
      subCategory: 'Americano',
      createdDate: '11th 2025, 23:59',
      image: '🥥',
      sellingPrice: 2.50,
      stock: 69,
      status: 'Published',
      description: 'Aged coconut americano',
    },
  ]);

  // Calculate stats
  const stats: StatsData = useMemo(() => {
    return {
      totalMenu: products.length,
      itemSales: products.reduce((sum, p) => sum + p.stock, 0),
      stockItems: products.filter(p => p.status !== 'Out of Stock').length,
      outOfStock: products.filter(p => p.status === 'Out of Stock').length,
    };
  }, [products]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Action Cell Renderer
  const ActionCellRenderer = useCallback((props: any) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <div className="flex items-center justify-center h-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/product/${props.data.id}`);
          }}
          className="px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          View Details
        </button>
      </div>
    );
  }, [router]);

  // Status Cell Renderer with Dropdown
  const StatusCellRenderer = useCallback((props: any) => {
    const status = props.value;
    const colorMap = {
      'Published': 'bg-green-100 text-green-700',
      'Draft List': 'bg-blue-100 text-blue-700',
      'Inactive': 'bg-red-100 text-red-700',
      'Out of Stock': 'bg-yellow-100 text-yellow-700',
    };

    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colorMap[status as keyof typeof colorMap]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {status}
        </span>
        <ChevronDown size={14} className="text-gray-400" />
      </div>
    );
  }, []);

  // Item Name Cell Renderer
  const ItemNameCellRenderer = useCallback((props: any) => {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center text-xl border border-gray-200">
          {props.data.image}
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{props.data.name}</div>
          <div className="text-xs text-gray-500">Coffee | {props.data.subCategory}</div>
        </div>
      </div>
    );
  }, []);

  // Price Cell Renderer
  const PriceCellRenderer = useCallback((props: any) => {
    const price = props.data.sellingPrice || props.data.dayPrice || 0;
    const originalPrice = price * 1.2;
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>
        <span className="text-xs text-gray-400 line-through">Sell Price ${originalPrice.toFixed(2)}</span>
      </div>
    );
  }, []);

  // ID Cell Renderer
  const IDCellRenderer = useCallback((props: any) => {
    return (
      <div className="flex flex-col py-2">
        <span className="font-medium text-gray-900 text-sm">{props.data.id}</span>
        <span className="text-xs text-gray-500">{props.data.createdDate}</span>
      </div>
    );
  }, []);

  // Column Definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Item Name',
      field: 'name',
      cellRenderer: ItemNameCellRenderer,
      flex: 2,
      minWidth: 250,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: 'ID & Create Date',
      field: 'id',
      flex: 1.5,
      minWidth: 180,
      cellRenderer: IDCellRenderer,
    },
    {
      headerName: 'Price & Sell Price',
      field: 'sellingPrice',
      flex: 1.2,
      minWidth: 150,
      cellRenderer: PriceCellRenderer,
    },
    {
      headerName: 'Stock',
      field: 'stock',
      flex: 0.8,
      minWidth: 100,
      cellStyle: { fontWeight: '500' },
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1.2,
      minWidth: 160,
      cellRenderer: StatusCellRenderer,
      filter: false,
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: ActionCellRenderer,
      flex: 1,
      minWidth: 140,
      sortable: false,
      filter: false,
    },
  ], [ItemNameCellRenderer, IDCellRenderer, PriceCellRenderer, StatusCellRenderer, ActionCellRenderer]);

  const defaultColDef: ColDef = useMemo(() => ({
    sortable: true,
    filter: false,
    resizable: true,
  }), []);

  const onSelectionChanged = useCallback((event: any) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRows(selectedRows);
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Menu"
            value={stats.totalMenu}
            subtitle="Menu items month"
            trend={{ value: '↑ 30%', type: 'increase', comparison: 'This month', showIcon: false }}
            variant="primary"
            style="light"
          />
          <StatCard
            title="Item Sales"
            value={stats.itemSales}
            subtitle="This month"
            trend={{ value: '↑ 20%', type: 'increase', comparison: 'This month', showIcon: false }}
            variant="primary"
            style="light"
          />
          <StatCard
            title="Stock Items"
            value={stats.stockItems}
            subtitle="This month"
            trend={{ value: '↑ 25.4%', type: 'increase', comparison: 'This month', showIcon: false }}
            variant="primary"
            style="light"
          />
          <StatCard
            title="Out of Stock"
            value={stats.outOfStock}
            subtitle="This month"
            trend={{ value: '↓ 5.6%', type: 'decrease', comparison: 'This month', showIcon: false }}
            variant="danger"
            style="light"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-200">
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <input
                type="text"
                placeholder="Search by name, item ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span>All Status</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span>01 May 2025 - 10 Jun</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                More Filters
              </button>
              <button
                onClick={() => router.push('/product/add-product')}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                <Plus size={16} />
                Add New 
              </button>
            </div>
          </div>

          {/* AG Grid Table */}
          <div className="w-full">
            <style>{`
              .ag-theme-alpine {
                --ag-border-color: #e5e7eb;
                --ag-header-background-color: #f9fafb;
                --ag-header-foreground-color: #374151;
                --ag-row-hover-color: #f9fafb;
                --ag-font-size: 14px;
                --ag-row-border-color: #f3f4f6;
              }
              .ag-theme-alpine .ag-header {
                border-bottom: 1px solid #e5e7eb;
              }
              .ag-theme-alpine .ag-header-cell {
                padding-left: 20px;
                padding-right: 20px;
              }
              .ag-theme-alpine .ag-cell {
                padding-left: 20px;
                padding-right: 20px;
                border-right: none;
              }
              .ag-theme-alpine .ag-row {
                border-bottom: 1px solid #f3f4f6;
              }
              .ag-theme-alpine .ag-root-wrapper {
                border: none;
              }
              .ag-theme-alpine .ag-checkbox-input-wrapper {
                font-size: 14px;
              }
              .ag-theme-alpine .ag-header-cell-label {
                font-weight: 600;
                font-size: 13px;
                color: #374151;
              }
            `}</style>

            <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={paginatedProducts}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowSelection="multiple"
                suppressRowClickSelection={true}
                onSelectionChanged={onSelectionChanged}
                onGridReady={onGridReady}
                animateRows={true}
                rowHeight={70}
                headerHeight={48}
                suppressPaginationPanel={true}
                suppressHorizontalScroll={false}
                domLayout="normal"
              />
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalRecords={filteredProducts.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            showFirstLastButtons={false}
            showPageInput={true}
            showRangeInfo={false}
            mode="full"
          />
        </div>
      </div>
    </div>
  );
}
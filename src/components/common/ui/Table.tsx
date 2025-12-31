// components/ui/Table.tsx
import { ReactNode } from "react";

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T, index: number) => ReactNode;
    width?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    striped?: boolean;
    hoverable?: boolean;
    bordered?: boolean;
    loading?: boolean;
    emptyMessage?: string;
    className?: string;
}

export default function Table<T extends Record<string, any>>({
    data,
    columns,
    striped = false,
    hoverable = true,
    bordered = true,
    loading = false,
    emptyMessage = "No data available",
    className = "",
}: TableProps<T>) {
    if (loading) {
        return (
            <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>
                <div className="flex items-center justify-center py-12 text-gray-500">
                    {emptyMessage}
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full overflow-x-auto ${className}`}>
            <div className={`${bordered ? "border border-gray-200 rounded-lg" : ""} overflow-hidden`}>
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                className={`
                  ${striped && index % 2 === 1 ? "bg-gray-50" : ""}
                  ${hoverable ? "hover:bg-gray-100 transition-colors" : ""}
                `}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-6 py-4 text-sm text-gray-900"
                                        style={{ width: column.width }}
                                    >
                                        {column.render
                                            ? column.render(item, index)
                                            : item[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import { FaShoppingCart, FaUsers, FaDollarSign, FaChartLine, FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function EcommercePage() {
    const stats = [
        {
            title: "Total Sales",
            value: "$54,239",
            change: "+12.5%",
            trend: "up",
            icon: FaDollarSign,
            color: "bg-green-500",
        },
        {
            title: "Total Orders",
            value: "3,842",
            change: "+8.2%",
            trend: "up",
            icon: FaShoppingCart,
            color: "bg-blue-500",
        },
        {
            title: "Total Customers",
            value: "1,234",
            change: "-2.4%",
            trend: "down",
            icon: FaUsers,
            color: "bg-purple-500",
        },
        {
            title: "Conversion Rate",
            value: "3.2%",
            change: "+0.5%",
            trend: "up",
            icon: FaChartLine,
            color: "bg-orange-500",
        },
    ];

    const recentOrders = [
        { id: "#12345", customer: "John Doe", product: "Wireless Headphones", amount: "$129.99", status: "Completed" },
        { id: "#12346", customer: "Jane Smith", product: "Smart Watch", amount: "$299.99", status: "Pending" },
        { id: "#12347", customer: "Mike Johnson", product: "Laptop Stand", amount: "$49.99", status: "Completed" },
        { id: "#12348", customer: "Sarah Williams", product: "USB-C Cable", amount: "$19.99", status: "Processing" },
        { id: "#12349", customer: "Tom Brown", product: "Keyboard", amount: "$89.99", status: "Completed" },
    ];

    const topProducts = [
        { name: "Wireless Headphones", sales: 342, revenue: "$44,458", trend: "+12%" },
        { name: "Smart Watch", sales: 289, revenue: "$86,671", trend: "+8%" },
        { name: "Laptop Stand", sales: 234, revenue: "$11,698", trend: "+15%" },
        { name: "USB-C Cable", sales: 567, revenue: "$11,340", trend: "+5%" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Ecommerce Dashboard</h1>
                <p className="text-gray-600 mt-1">Monitor your online store performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const TrendIcon = stat.trend === "up" ? FaArrowUp : FaArrowDown;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                                    }`}>
                                    <TrendIcon className="w-3 h-3" />
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{order.customer}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{order.product}</td>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.amount}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "Completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={product.name} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-500">{product.sales} sales</p>
                                        <span className="text-xs text-green-600 font-medium">{product.trend}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sales Chart Placeholder */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart will be displayed here</p>
                </div>
            </div>
        </div>
    );
}
"use client";

import { PackageCheck, Clock, Truck } from "lucide-react";

export default function AdminOrders() {
    const orders = [
        { id: 1, user: "Swathi", total: 499, status: "Preparing" },
        { id: 2, user: "Ravi", total: 299, status: "Delivered" },
        { id: 3, user: "Arjun", total: 799, status: "Out for Delivery" },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Preparing":
                return "bg-yellow-100 text-yellow-600";
            case "Delivered":
                return "bg-green-100 text-green-600";
            case "Out for Delivery":
                return "bg-blue-100 text-blue-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Preparing":
                return <Clock size={16} />;
            case "Delivered":
                return <PackageCheck size={16} />;
            case "Out for Delivery":
                return <Truck size={16} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Orders
                </h1>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-5 rounded-xl border border-gray-100 hover:shadow-md transition"
                        >
                            {/* Left */}
                            <div>
                                <p className="font-semibold text-gray-800">
                                    Order #{order.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Customer: {order.user}
                                </p>
                            </div>

                            {/* Center Price */}
                            <div className="text-lg font-semibold text-[#7C3AED] md:text-center">
                                ₹{order.total}
                            </div>

                            {/* Right Status */}
                            <div className="md:flex md:justify-end">
                                <div
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
                                        order.status
                                    )}`}
                                >
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useOrders } from "@/context/OrderContext";

export default function OrdersPage() {
    const { orders } = useOrders(); // ✅ GET REAL ORDERS

    return (
        <section className="min-h-screen bg-purple-50 pt-28 pb-16 px-6">
            <div className="max-w-5xl mx-auto space-y-10">

                <h1 className="text-3xl font-bold text-purple-700">
                    My Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-md">
                        <p className="text-gray-500 text-lg mb-6">
                            You haven’t placed any orders yet.
                        </p>
                        <Link
                            href="/menu"
                            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                        >
                            Start Ordering
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-3xl shadow-md p-8 space-y-6"
                        >
                            {/* Top Section */}
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Order #{order.id}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Placed on {order.date} at {order.time}
                                    </p>
                                </div>

                                <StatusBadge status={order.status} />
                            </div>

                            {/* Items */}
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between border-b pb-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div>
                                                <h3 className="font-medium">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="font-semibold text-purple-700">
                                            ₹{item.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Section */}
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg font-semibold">
                                    Total: ₹{order.total}
                                </span>

                                <Link
                                    href="/menu"
                                    className="bg-purple-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-purple-700 transition"
                                >
                                    Reorder
                                </Link>
                            </div>
                        </div>
                    ))
                )}

            </div>
        </section>
    );
}

/* Status Badge Component */
function StatusBadge({
    status,
}: {
    status: "delivered" | "preparing" | "cancelled";
}) {
    if (status === "delivered")
        return (
            <span className="flex items-center gap-2 text-green-600 bg-green-100 px-4 py-2 rounded-full text-sm font-semibold">
                <CheckCircle2 size={16} />
                Delivered
            </span>
        );

    if (status === "preparing")
        return (
            <span className="flex items-center gap-2 text-yellow-600 bg-yellow-100 px-4 py-2 rounded-full text-sm font-semibold">
                <Clock size={16} />
                Preparing
            </span>
        );

    return (
        <span className="flex items-center gap-2 text-red-600 bg-red-100 px-4 py-2 rounded-full text-sm font-semibold">
            <XCircle size={16} />
            Cancelled
        </span>
    );
}
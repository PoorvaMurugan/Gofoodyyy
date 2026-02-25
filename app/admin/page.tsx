"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminDashboard() {
    const stats = useQuery(api.dashboard.getDashboardStats);

    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold">Total Orders</h2>
                    <p className="text-2xl font-bold mt-2">
                        {stats.totalOrders}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-2xl font-bold mt-2">
                        ₹{stats.totalRevenue}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold">Total Users</h2>
                    <p className="text-2xl font-bold mt-2">
                        {stats.totalUsers}
                    </p>
                </div>
            </div>
        </div>
    );
}
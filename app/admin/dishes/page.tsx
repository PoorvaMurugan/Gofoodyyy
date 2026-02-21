"use client";

import { useState } from "react";
import AddDishForm from "./AddDishForm";
import ViewDishes from "./ViewDishes";

export default function AdminDishesPage() {
    const [activeTab, setActiveTab] = useState<"add" | "view">("add");

    return (
        <div className="p-8">

            {/* Top Buttons */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab("add")}
                    className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === "add"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                >
                    ➕ Add Dish
                </button>

                <button
                    onClick={() => setActiveTab("view")}
                    className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === "view"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                >
                    📋 View Dishes
                </button>
            </div>

            {/* Render Section */}
            {activeTab === "add" ? <AddDishForm /> : <ViewDishes />}
        </div>
    );
}
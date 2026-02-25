"use client";

import { useState } from "react";
import ViewDishes from "./ViewDishes";
import ViewCategories from "./ViewCategories";
import AddDishForm from "./AddDishForm";
import AddCategoryForm from "./AddCategoryForm";
import SideDrawer from "./SideDrawer";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDishesPage() {
    const [activeTab, setActiveTab] = useState<"dishes" | "categories">("dishes");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingDish, setEditingDish] = useState<any>(null);

    return (
        <div className="p-8">

            {/* TOP BAR */}
            <div className="flex items-center justify-between mb-8">

                {/* Pills */}
                <div className="flex bg-white p-1 rounded-xl shadow-md border border-purple-200">
                    {["dishes", "categories"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className="relative px-6 py-2 text-sm font-medium rounded-lg"
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-purple-600 rounded-lg"
                                />
                            )}

                            <span
                                className={`relative z-10 ${activeTab === tab ? "text-white" : "text-zinc-400"
                                    }`}
                            >
                                {tab === "dishes" ? "Dishes" : "Categories"}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Add Button */}
                <button
                    onClick={() => {
                        setEditingDish(null); // Important
                        setDrawerOpen(true);
                    }}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
                >
                    <Plus size={16} />
                    {activeTab === "dishes" ? "Add Dish" : "Add Category"}
                </button>

            </div>

            {/* TABLE */}
            {activeTab === "dishes" ? (
                <ViewDishes
                    onEdit={(dish) => {
                        setEditingDish(dish);
                        setDrawerOpen(true);
                    }}
                />
            ) : (
                <ViewCategories />
            )}

            {/* DRAWER */}
            <SideDrawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingDish(null);
                }}
            >
                {activeTab === "dishes" ? (
                    <AddDishForm
                        editData={editingDish || undefined}
                        onClose={() => {
                            setDrawerOpen(false);
                            setEditingDish(null);
                        }}
                    />
                ) : (
                    <AddCategoryForm
                        onClose={() => setDrawerOpen(false)}
                    />
                )}
            </SideDrawer>
        </div>
    );
}
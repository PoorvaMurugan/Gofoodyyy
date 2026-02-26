"use client";

import { useState } from "react";
import ViewDishes from "./ViewDishes";
import ViewCategories from "./ViewCategories";
import AddDishForm from "./AddDishForm";
import AddCategoryForm from "./AddCategoryForm";
import SideDrawer from "./SideDrawer";
import { Plus } from "lucide-react";

type TabType = "dishes" | "categories";

export default function AdminDishesPage() {
    const [activeTab, setActiveTab] = useState<TabType>("dishes");
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [editingDish, setEditingDish] = useState<any>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const handleAdd = () => {
        setEditingDish(null);
        setEditingCategory(null);
        setDrawerOpen(true);
    };

    const handleEditDish = (dish: any) => {
        setEditingDish(dish);
        setEditingCategory(null);
        setDrawerOpen(true);
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category);
        setEditingDish(null);
        setDrawerOpen(true);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            {/* ================= TOP BAR ================= */}
            <div className="flex items-center justify-between mb-6">

                {/* GitHub Style Tabs */}
                <div className="border-b border-gray-200 w-full">
                    <nav className="flex gap-6">
                        {(["dishes", "categories"] as TabType[]).map((tab) => {
                            const isActive = activeTab === tab;

                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                    py-3 text-sm font-medium border-b-2 transition-colors
                    ${isActive
                                            ? "border-gray-900 text-gray-900"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }
                  `}
                                >
                                    {tab === "dishes" ? "Dishes" : "Categories"}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* GitHub Style Add Button */}
                <button
                    onClick={handleAdd}
                    className="ml-6 flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg text-sm font-semibold whitespace-nowrap min-w-[180px] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <Plus size={16} />
                    {activeTab === "dishes" ? "New Dish" : "New Category"}
                </button>
            </div>

            {/* ================= TABLE SECTION ================= */}
            <div className="bg-white border border-gray-200 rounded-md p-6">
                {activeTab === "dishes" ? (
                    <ViewDishes onEdit={handleEditDish} />
                ) : (
                    <ViewCategories onEdit={handleEditCategory} />
                )}
            </div>

            {/* ================= SIDE DRAWER ================= */}
            <SideDrawer
                isOpen={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingDish(null);
                    setEditingCategory(null);
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
                        editData={editingCategory || undefined}
                        onClose={() => {
                            setDrawerOpen(false);
                            setEditingCategory(null);
                        }}
                    />
                )}
            </SideDrawer>
        </div>
    );
}
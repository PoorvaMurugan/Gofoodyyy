"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { MoreVertical } from "lucide-react";

export default function ViewDishes({
    onEdit,
}: {
    onEdit: (dish: any) => void;
}) {
    const dishes = useQuery(api.dishes.getAllDishes);
    const categories = useQuery(api.categories.getAllCategories);

    const deleteDish = useMutation(api.dishes.deleteDish);
    const toggleAvailability = useMutation(api.dishes.toggleAvailability);

    const [loadingId, setLoadingId] = useState<Id<"dishes"> | null>(null);
    const [viewDish, setViewDish] = useState<any>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    const handleDelete = async (id: Id<"dishes">) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this dish?"
        );
        if (!confirmDelete) return;

        await deleteDish({ id });
    };

    const getCategoryName = (categoryId: Id<"categories">) => {
        if (!categories) return "Unknown";
        const category = categories.find((c) => c._id === categoryId);
        return category ? category.name : "Unknown";
    };

    const filteredDishes = useMemo(() => {
        if (!dishes) return [];

        return dishes.filter((dish) => {
            const matchesSearch =
                dish.name.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "all" ||
                String(dish.categoryId) === selectedCategory;

            const matchesAvailability =
                availabilityFilter === "all" ||
                (availabilityFilter === "available" && dish.stock > 0) ||
                (availabilityFilter === "out" && dish.stock === 0);

            return matchesSearch && matchesCategory && matchesAvailability;
        });
    }, [dishes, search, selectedCategory, availabilityFilter]);

    if (!dishes || !categories) {
        return <p className="text-center mt-10">Loading dishes...</p>;
    }

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-semibold">Dishes</h1>
                <p className="text-sm text-purple-500">
                    {dishes.length} dishes in {categories.length} categories
                </p>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="bg-white p-4 rounded-2xl shadow flex flex-wrap gap-4 items-center justify-between">

                <div className="flex flex-wrap gap-4 items-center">

                    <input
                        type="text"
                        placeholder="Search dishes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded-lg w-60"
                    />

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border p-2 rounded-lg"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    {["all", "available", "out"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setAvailabilityFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-sm ${availabilityFilter === status
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                                }`}
                        >
                            {status === "all"
                                ? "All"
                                : status === "available"
                                    ? "Available"
                                    : "Out of Stock"}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-lg">
                <table className="w-full text-sm">
                    <thead className="bg-purple-50">
                        <tr className="text-left">
                            <th className="px-6 py-4 font-semibold">Item Name</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 text-center font-semibold">Stock</th>
                            <th className="px-6 py-4 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {filteredDishes.map((dish) => (
                            <tr key={dish._id} className="hover:bg-gray-50 transition relative">
                                <td className="px-6 py-4 font-medium">
                                    {dish.name}
                                </td>

                                <td className="px-6 py-4">
                                    {getCategoryName(dish.categoryId)}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    {dish.stock === 0 ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                            Out of Stock
                                        </span>
                                    ) : dish.stock <= dish.threshold ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                            Only {dish.stock} Left
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            In Stock
                                        </span>
                                    )}
                                </td>

                                {/* ACTIONS COLUMN */}
                                <td className="px-6 py-4 text-center relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(
                                                openMenuId === dish._id
                                                    ? null
                                                    : dish._id
                                            );
                                        }}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {openMenuId === dish._id && (
                                        <div className="absolute right-6 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50">
                                            <button
                                                onClick={() => {
                                                    setViewDish(dish);
                                                    setOpenMenuId(null);
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() => {
                                                    onEdit(dish);
                                                    setOpenMenuId(null);
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => {
                                                    handleDelete(dish._id);
                                                    setOpenMenuId(null);
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredDishes.length === 0 && (
                    <p className="text-center py-6 text-gray-500">
                        No matching dishes found.
                    </p>
                )}
            </div>

            {/* VIEW MODAL */}
            {viewDish && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setViewDish(null)}
                >
                    <div
                        className="bg-white p-8 rounded-2xl w-[600px] max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-64 mb-6 rounded-xl overflow-hidden">
                            <img
                                src={viewDish.image}
                                alt={viewDish.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h2 className="text-2xl font-bold mb-4">
                            {viewDish.name}
                        </h2>

                        <p>Category: {getCategoryName(viewDish.categoryId)}</p>
                        <p>Price: ₹{viewDish.price}</p>
                        <p>Rating: {viewDish.rating}</p>
                        <p>Type: {viewDish.type}</p>

                        <p className="mt-4 text-gray-600">
                            {viewDish.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
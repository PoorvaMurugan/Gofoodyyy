"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useMemo } from "react";
import { Id } from "@/convex/_generated/dataModel";
import AddCategoryForm from "./AddCategoryForm";
import { Search, X, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";

export default function ViewCategories() {
    const categories = useQuery(api.categories.getCategories);
    const deleteCategory = useMutation(api.categories.deleteCategory);

    const [viewCategory, setViewCategory] = useState<any>(null);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // ESC close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setViewCategory(null);
                setEditingCategory(null);
                setOpenMenu(null);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const closeMenu = () => setOpenMenu(null);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    const handleDelete = async (id: Id<"categories">) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );
        if (!confirmDelete) return;

        await deleteCategory({ id });
    };

    const filteredCategories = useMemo(() => {
        if (!categories) return [];

        return categories.filter((cat) => {
            const matchesSearch = cat.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesDropdown =
                selectedCategory === "all" || cat._id === selectedCategory;

            return matchesSearch && matchesDropdown;
        });
    }, [categories, search, selectedCategory]);

    if (!categories) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* FILTER BAR */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center flex-wrap">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-2.5 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-10 py-2 border rounded-xl w-64 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        {search && (
                            <X
                                size={18}
                                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-red-500"
                                onClick={() => setSearch("")}
                            />
                        )}
                    </div>

                    {/* Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border px-3 py-2 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold">
                        {filteredCategories.length}
                    </span>{" "}
                    result(s)
                </p>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold">
                                Category
                            </th>
                            <th className="px-6 py-4 text-right font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {filteredCategories.map((cat) => (
                            <tr
                                key={cat._id}
                                className="hover:bg-purple-50/40 transition"
                            >
                                <td className="px-6 py-4 font-medium">
                                    {cat.name}
                                </td>

                                {/* ACTION CELL */}
                                <td className="px-6 py-4">
                                    <div className="relative flex justify-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenu(
                                                    openMenu === cat._id ? null : cat._id
                                                );
                                            }}
                                            className="p-2 rounded-full hover:bg-gray-100 transition"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {openMenu === cat._id && (
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute right-0 top-full mt-2 w-40 bg-white shadow-2xl rounded-xl border z-50 animate-scaleIn"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setViewCategory(cat);
                                                        setOpenMenu(null);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-purple-50 w-full text-left"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setEditingCategory(cat);
                                                        setOpenMenu(null);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 w-full text-left"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        handleDelete(cat._id);
                                                        setOpenMenu(null);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600 w-full text-left"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* VIEW MODAL */}
            {viewCategory && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setViewCategory(null)}
                >
                    <div
                        className="bg-white p-8 rounded-3xl w-[500px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-56 mb-6 rounded-2xl overflow-hidden shadow">
                            <img
                                src={viewCategory.image}
                                alt={viewCategory.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-center">
                            {viewCategory.name}
                        </h2>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingCategory && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setEditingCategory(null)}
                >
                    <div
                        className="w-[700px] max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AddCategoryForm
                            editData={editingCategory}
                            onClose={() => setEditingCategory(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
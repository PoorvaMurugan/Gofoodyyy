"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Search, X, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/admin/table/DataTable";

interface Props {
    onEdit: (category: any) => void;
}

export default function ViewCategories({ onEdit }: Props) {
    const categories = useQuery(api.categories.getCategories);
    const deleteCategory = useMutation(api.categories.deleteCategory);

    const [viewCategory, setViewCategory] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

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
        return <p className="text-center mt-10">Loading categories...</p>;
    }

    type CategoryType = typeof filteredCategories[number];

    const columns = [
        {
            header: "Category",
            accessor: "name" as keyof CategoryType,
        },
        {
            header: "Actions",
            cell: (cat: CategoryType) => (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="cursor-pointer" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => setViewCategory(cat)}
                            className="flex items-center gap-2"
                        >
                            <Eye size={14} /> View
                        </DropdownMenuItem>

                        {/* 🔥 THIS NOW CALLS PAGE DRAWER */}
                        <DropdownMenuItem
                            onClick={() => onEdit(cat)}
                            className="flex items-center gap-2"
                        >
                            <Pencil size={14} /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleDelete(cat._id)}
                            className="flex items-center gap-2 text-red-600"
                        >
                            <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">

            {/* FILTER BAR */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center flex-wrap">

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
                            className="pl-10 pr-10 py-2 border border-gray-200 rounded-md w-64 text-sm"
                        />
                        {search && (
                            <X
                                size={18}
                                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-red-500"
                                onClick={() => setSearch("")}
                            />
                        )}
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-200 px-3 py-2 rounded-md text-sm"
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
                    <span className="font-medium">
                        {filteredCategories.length}
                    </span>{" "}
                    result(s)
                </p>
            </div>

            <DataTable<CategoryType>
                columns={columns}
                data={filteredCategories}
                loading={!categories}
            />

            {/* VIEW MODAL (KEEP THIS) */}
            {viewCategory && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setViewCategory(null)}
                >
                    <div
                        className="bg-white p-8 rounded-md w-[500px] border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-56 mb-6 rounded-md overflow-hidden">
                            <img
                                src={viewCategory.image}
                                alt={viewCategory.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h2 className="text-2xl font-semibold text-center">
                            {viewCategory.name}
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
}
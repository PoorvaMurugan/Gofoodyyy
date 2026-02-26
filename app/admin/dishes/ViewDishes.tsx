"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { MoreVertical, Eye, Trash, Pencil } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/admin/table/DataTable";

export default function ViewDishes({
    onEdit,
}: {
    onEdit: (dish: any) => void;
}) {
    const dishes = useQuery(api.dishes.getAllDishes);
    const categories = useQuery(api.categories.getAllCategories);

    const deleteDish = useMutation(api.dishes.deleteDish);

    const [viewDish, setViewDish] = useState<any>(null);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [availabilityFilter, setAvailabilityFilter] = useState("all");

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

    type DishType = typeof filteredDishes[number];

    const columns = [
        { header: "Item Name", accessor: "name" as keyof DishType },

        {
            header: "Category",
            cell: (dish: DishType) =>
                getCategoryName(dish.categoryId),
        },

        {
            header: "Stock",
            cell: (dish: DishType) =>
                dish.stock === 0 ? (
                    <span className="text-red-600 font-medium">
                        Out of Stock
                    </span>
                ) : dish.stock <= dish.threshold ? (
                    <span className="text-yellow-600 font-medium">
                        Only {dish.stock} Left
                    </span>
                ) : (
                    <span className="text-green-600 font-medium">
                        In Stock
                    </span>
                ),
        },

        {
            header: "Actions",
            cell: (dish: DishType) => (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="cursor-pointer" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => setViewDish(dish)}
                            className="flex items-center gap-2"
                        >
                            <Eye size={16} /> View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => onEdit(dish)}
                            className="flex items-center gap-2"
                        >
                            <Pencil size={16} /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={async () => {
                                const confirmDelete = window.confirm(
                                    "Are you sure you want to delete this dish?"
                                );
                                if (!confirmDelete) return;
                                await deleteDish({
                                    id: dish._id as Id<"dishes">,
                                });
                            }}
                            className="flex items-center gap-2 text-red-600"
                        >
                            <Trash size={16} /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">

            {/* SEARCH + FILTERS */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search dishes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-200 rounded-md px-4 py-2 w-60 text-sm"
                    />

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-200 rounded-md px-3 py-2 text-sm"
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
                            className={`px-3 py-1.5 rounded-md text-sm ${availabilityFilter === status
                                    ? "bg-gray-900 text-white"
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

            <DataTable<DishType>
                columns={columns}
                data={filteredDishes}
                loading={!dishes}
            />

            {/* VIEW MODAL */}
            {viewDish && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setViewDish(null)}
                >
                    <div
                        className="bg-white p-8 rounded-md w-[600px] max-h-[90vh] overflow-y-auto border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-64 mb-6 rounded-md overflow-hidden">
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
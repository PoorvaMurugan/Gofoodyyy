"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { Id } from "@/convex/_generated/dataModel";
import {
    MoreVertical,
    Eye,
    Trash,
    Pencil,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/admin/table/DataTable";
import SideDrawer from "./SideDrawer";

export default function ViewDishes({
    onEdit,
}: {
    onEdit: (dish: any) => void;
}) {
    const dishes = useQuery(api.dishes.getAllDishes);
    const categories = useQuery(api.categories.getCategories);
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

    const getStockStatus = (stock: number, threshold: number) => {
        if (stock === 0)
            return <span className="text-red-600 font-medium">Out of Stock</span>;

        if (stock <= threshold)
            return (
                <span className="text-yellow-600 font-medium">
                    Only {stock} Left
                </span>
            );

        return <span className="text-green-600 font-medium">In Stock</span>;
    };

    const filteredDishes = useMemo(() => {
        if (!dishes) return [];

        return dishes.filter((dish) => {
            const matchesSearch = dish.name
                .toLowerCase()
                .includes(search.toLowerCase());

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
        return (
            <div className="space-y-3 mt-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
            </div>
        );
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
                getStockStatus(dish.stock, dish.threshold),
        },

        {
            header: "Actions",
            cell: (dish: DishType) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition">
                            <MoreVertical size={18} />
                        </button>
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

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex items-center gap-2 text-red-600"
                                >
                                    <Trash size={16} /> Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Dish?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete{" "}
                                        <span className="font-semibold">
                                            {dish.name}
                                        </span>.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={async () => {
                                            await deleteDish({
                                                id: dish._id as Id<"dishes">,
                                            });
                                        }}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">

            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">

                    <input
                        type="text"
                        placeholder="Search dishes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-200 rounded-md px-4 py-2 w-60 text-sm"
                    />

                    <Select
                        value={selectedCategory}
                        onValueChange={(value) =>
                            setSelectedCategory(value)
                        }
                    >
                        <SelectTrigger className="w-[180px] h-10 text-sm">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Categories
                            </SelectItem>

                            {categories.map((cat) => (
                                <SelectItem
                                    key={cat._id}
                                    value={String(cat._id)}
                                >
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    {["all", "available", "out"].map((status) => (
                        <button
                            key={status}
                            onClick={() =>
                                setAvailabilityFilter(status)
                            }
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

            <SideDrawer
                isOpen={!!viewDish}
                onClose={() => setViewDish(null)}
                title="Dish Details"
            >
                {viewDish && (
                    <div className="space-y-6">

                        <div className="w-full h-64 rounded-md overflow-hidden border">
                            <img
                                src={viewDish.image}
                                alt={viewDish.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold">
                                {viewDish.name}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {getCategoryName(viewDish.categoryId)}
                            </p>
                        </div>

                        <div className="space-y-2 text-sm">
                            <p><strong>Price:</strong> ₹{viewDish.price}</p>
                            <p><strong>Serving:</strong> {viewDish.serving}</p>
                            <p><strong>Type:</strong> {viewDish.type}</p>
                            <p><strong>Threshold:</strong> {viewDish.threshold}</p>
                            <p><strong>Stock:</strong> {viewDish.stock}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">
                                Nutrition
                            </h3>
                            <p className="text-sm text-gray-600">
                                {viewDish.nutrition}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">
                                Description
                            </h3>
                            <p className="text-sm text-gray-600">
                                {viewDish.description}
                            </p>
                        </div>

                    </div>
                )}
            </SideDrawer>

        </div>
    );
}
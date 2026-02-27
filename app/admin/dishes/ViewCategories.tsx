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

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import { DataTable } from "@/components/admin/table/DataTable";
import SideDrawer from "./SideDrawer";

interface Props {
    onEdit: (category: any) => void;
}

export default function ViewCategories({ onEdit }: Props) {
    const categories = useQuery(api.categories.getCategories);
    const deleteCategory = useMutation(api.categories.deleteCategory);

    const [viewCategory, setViewCategory] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

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

    // ✅ SKELETON LOADING
    if (!categories) {
        return (
            <div className="space-y-3 mt-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
            </div>
        );
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
                    <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition">
                            <MoreVertical size={18} />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                        <DropdownMenuItem
                            onClick={() => setViewCategory(cat)}
                            className="flex items-center gap-2"
                        >
                            <Eye size={14} /> View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => onEdit(cat)}
                            className="flex items-center gap-2"
                        >
                            <Pencil size={14} /> Edit
                        </DropdownMenuItem>

                        {/* ✅ SHADCN ALERT DIALOG DELETE */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 size={14} /> Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Category?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete{" "}
                                        <span className="font-semibold">
                                            {cat.name}
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
                                            await deleteCategory({
                                                id: cat._id as Id<"categories">,
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

                    <Select
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value)}
                    >
                        <SelectTrigger className="w-[180px] h-10 text-sm">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>

                            {categories.map((cat) => (
                                <SelectItem key={cat._id} value={cat._id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

            {/* SIDE DRAWER */}
            <SideDrawer
                isOpen={!!viewCategory}
                onClose={() => setViewCategory(null)}
                title="Category Details"
            >
                {viewCategory && (
                    <div className="space-y-6">

                        <div className="w-full h-56 rounded-md overflow-hidden border">
                            <img
                                src={viewCategory.image}
                                alt={viewCategory.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">
                                {viewCategory.name}
                            </h2>
                        </div>

                    </div>
                )}
            </SideDrawer>

        </div>
    );
}
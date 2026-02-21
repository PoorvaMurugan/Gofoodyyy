"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Minus, Star, Heart, Search, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@stackframe/stack";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Dish {
    _id: string;
    name: string;
    category: string;
    price: number;
    serving: string;
    rating: number;
    image: string;
    description: string;
    nutrition: string;
    type: "veg" | "nonveg";
}

export default function MenuClient({ dishes }: { dishes: Dish[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const user = useUser();

    const { cart, addToCart, increaseQty, decreaseQty } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } =
        useWishlist();

    const [activeCategory, setActiveCategory] =
        useState<string | null>(null);
    const [selectedDish, setSelectedDish] =
        useState<Dish | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [foodType, setFoodType] =
        useState<"all" | "veg" | "nonveg">("all");

    const [sort, setSort] =
        useState<"none" | "low" | "high">("none");

    const urlCategory = searchParams.get("category");

    useEffect(() => {
        if (urlCategory) setActiveCategory(urlCategory);
        else setActiveCategory(null);
    }, [urlCategory]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    // 🔎 Filtering Logic
    const filteredDishes = useMemo(() => {
        let result = [...dishes];

        if (activeCategory) {
            result = result.filter(
                (dish) => dish.category === activeCategory
            );
        }

        if (debouncedSearch) {
            result = result.filter((dish) =>
                dish.name
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
            );
        }

        if (foodType !== "all") {
            result = result.filter(
                (dish) => dish.type === foodType
            );
        }

        if (sort === "low") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sort === "high") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [dishes, activeCategory, debouncedSearch, foodType, sort]);

    const categories = [
        "all",
        ...new Set(dishes.map((d) => d.category)),
    ];

    const requireAuth = (action: () => void) => {
        if (!user) {
            router.push("/login");
            return;
        }
        action();
    };

    return (
        <section className="pt-28 pb-16 bg-purple-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 space-y-10">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700">
                    Explore Our Menu
                </h1>

                {/* ================= FILTER SECTION ================= */}
                <div className="space-y-6 max-w-5xl mx-auto">

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                        />
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() =>
                                    setActiveCategory(
                                        cat === "all" ? null : cat
                                    )
                                }
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                ${(activeCategory ?? "all") === cat
                                        ? "bg-purple-600 text-white scale-105 shadow-md"
                                        : "bg-white border border-purple-200 hover:bg-purple-50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Veg + Sort + Clear */}
                    <div className="flex flex-wrap gap-4 justify-center">

                        {["all", "veg", "nonveg"].map((type) => (
                            <button
                                key={type}
                                onClick={() =>
                                    setFoodType(type as any)
                                }
                                className={`px-4 py-2 rounded-xl text-sm transition
                                ${foodType === type
                                        ? "bg-purple-600 text-white"
                                        : "bg-white border border-purple-200 hover:bg-purple-50"
                                    }`}
                            >
                                {type === "all"
                                    ? "All"
                                    : type === "veg"
                                        ? "Veg"
                                        : "Non-Veg"}
                            </button>
                        ))}

                        <button
                            onClick={() => setSort("low")}
                            className={`px-4 py-2 rounded-xl text-sm transition
                            ${sort === "low"
                                    ? "bg-purple-600 text-white"
                                    : "bg-white border border-purple-200"
                                }`}
                        >
                            Price ↑
                        </button>

                        <button
                            onClick={() => setSort("high")}
                            className={`px-4 py-2 rounded-xl text-sm transition
                            ${sort === "high"
                                    ? "bg-purple-600 text-white"
                                    : "bg-white border border-purple-200"
                                }`}
                        >
                            Price ↓
                        </button>

                        <button
                            onClick={() => {
                                setSearch("");
                                setDebouncedSearch("");
                                setActiveCategory(null);
                                setFoodType("all");
                                setSort("none");
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                            <X size={16} />
                            Clear
                        </button>
                    </div>
                </div>

                {/* ================= CATEGORY WISE DISPLAY ================= */}
                {[
                    ...new Set(filteredDishes.map((d) => d.category)),
                ].map((category) => {
                    const categoryItems = filteredDishes.filter(
                        (dish) => dish.category === category
                    );

                    if (categoryItems.length === 0) return null;

                    return (
                        <div key={category} className="space-y-6 mt-12">
                            <h2 className="text-2xl font-bold text-purple-700">
                                {category}
                            </h2>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {categoryItems.map((dish) => {
                                    const inWishlist =
                                        isInWishlist(dish._id);
                                    const cartItem = cart.find(
                                        (c) => c.id === dish._id
                                    );
                                    const qty =
                                        cartItem?.quantity || 0;

                                    return (
                                        <div
                                            key={dish._id}
                                            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition"
                                        >
                                            <div className="relative h-48 w-full">
                                                <Image
                                                    src={dish.image}
                                                    alt={dish.name}
                                                    fill
                                                    className="object-cover"
                                                />

                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <div
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${dish.type === "veg"
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                            }`}
                                                    >
                                                        {dish.type === "veg"
                                                            ? "Veg"
                                                            : "Non-Veg"}
                                                    </div>

                                                    <div className="bg-white/90 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                                                        <Star
                                                            size={12}
                                                            className="text-yellow-500 fill-yellow-500"
                                                        />
                                                        {dish.rating}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        requireAuth(() => {
                                                            if (inWishlist)
                                                                removeFromWishlist(
                                                                    dish._id
                                                                );
                                                            else
                                                                addToWishlist({
                                                                    id: dish._id,
                                                                    name: dish.name,
                                                                    price: dish.price,
                                                                    image: dish.image,
                                                                });
                                                        })
                                                    }
                                                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
                                                >
                                                    <Heart
                                                        size={16}
                                                        className={
                                                            inWishlist
                                                                ? "text-red-500 fill-red-500"
                                                                : "text-gray-400"
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            <div className="p-5 space-y-3">
                                                <h3 className="font-semibold text-lg">
                                                    {dish.name}
                                                </h3>

                                                <p className="text-purple-700 font-bold">
                                                    ₹{dish.price}
                                                </p>

                                                <p
                                                    onClick={() =>
                                                        setSelectedDish(
                                                            dish
                                                        )
                                                    }
                                                    className="text-sm text-purple-600 underline cursor-pointer hover:text-purple-800"
                                                >
                                                    View Details
                                                </p>

                                                {qty === 0 ? (
                                                    <button
                                                        onClick={() =>
                                                            requireAuth(
                                                                () =>
                                                                    addToCart({
                                                                        id: dish._id,
                                                                        name: dish.name,
                                                                        price: dish.price,
                                                                        image: dish.image,
                                                                    })
                                                            )
                                                        }
                                                        className="w-full bg-purple-600 text-white py-2 rounded-xl font-medium hover:scale-105 transition"
                                                    >
                                                        Add
                                                    </button>
                                                ) : (
                                                    <div className="flex justify-between items-center bg-purple-600 text-white px-4 py-2 rounded-xl">
                                                        <button
                                                            onClick={() =>
                                                                decreaseQty(
                                                                    dish._id
                                                                )
                                                            }
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span>{qty}</span>
                                                        <button
                                                            onClick={() =>
                                                                increaseQty(
                                                                    dish._id
                                                                )
                                                            }
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ================= DIALOG ================= */}
            <Dialog
                open={!!selectedDish}
                onOpenChange={() => setSelectedDish(null)}
            >
                <DialogContent className="max-w-3xl rounded-3xl">
                    {selectedDish && (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="relative h-64 md:h-full w-full rounded-2xl overflow-hidden">
                                <Image
                                    src={selectedDish.image}
                                    alt={selectedDish.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="space-y-4">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">
                                        {selectedDish.name}
                                    </DialogTitle>
                                </DialogHeader>

                                <p className="text-purple-700 font-semibold text-lg">
                                    ₹{selectedDish.price}
                                </p>

                                <p className="text-gray-600 text-sm">
                                    {selectedDish.description}
                                </p>

                                <div className="bg-purple-50 p-4 rounded-xl">
                                    <h4 className="font-semibold mb-2">
                                        Nutrition Info
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {selectedDish.nutrition}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
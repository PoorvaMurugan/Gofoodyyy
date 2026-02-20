"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Minus, Star, Heart } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@stackframe/stack";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/* ============================
   Dish Type
============================ */
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

/* ============================
   COMPONENT
============================ */
export default function MenuPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const user = useUser();

    const dishes = useQuery(api.dishes.getDishes) as
        | Dish[]
        | undefined;

    const { cart, addToCart, increaseQty, decreaseQty } =
        useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } =
        useWishlist();

    const [selectedDish, setSelectedDish] =
        useState<Dish | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeCategory, setActiveCategory] =
        useState<string | null>(null);

    const urlCategory = searchParams.get("category");

    useEffect(() => {
        if (urlCategory) setActiveCategory(urlCategory);
        else setActiveCategory(null);
    }, [urlCategory]);

    /* ============================
       SAFE MEMOS (Always Run)
    ============================ */
    const categories = useMemo(() => {
        if (!dishes) return [];
        return [...new Set(dishes.map((d) => d.category))];
    }, [dishes]);

    const filteredDishes = useMemo(() => {
        if (!dishes) return [];
        if (!activeCategory) return dishes;
        return dishes.filter(
            (dish) => dish.category === activeCategory
        );
    }, [activeCategory, dishes]);

    const requireAuth = (action: () => void) => {
        if (!user) {
            router.push("/login");
            return;
        }
        action();
    };

    /* ============================
       AFTER ALL HOOKS
    ============================ */
    if (!dishes) {
        return (
            <div className="p-10 text-center">
                Loading menu...
            </div>
        );
    }

    return (
        <section className="py-16 bg-purple-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 space-y-10">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700">
                    Explore Our Menu
                </h1>

                {/* GRID */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredDishes.map((dish) => {
                        const inWishlist = isInWishlist(dish._id);
                        const cartItem = cart.find(
                            (c) => c.id === dish._id
                        );
                        const qty = cartItem?.quantity || 0;

                        return (
                            <div
                                key={dish._id}
                                onClick={() => {
                                    setSelectedDish(dish);
                                    setQuantity(1);
                                }}
                                className="bg-white rounded-3xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
                            >
                                {/* IMAGE */}
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={dish.image}
                                        alt={dish.name}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Veg + Rating */}
                                    <div className="absolute top-4 left-4 flex gap-2 items-center">
                                        <div
                                            className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow ${dish.type === "veg"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                }`}
                                        >
                                            {dish.type === "veg"
                                                ? "Veg"
                                                : "Non-Veg"}
                                        </div>

                                        <div className="bg-white/90 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow">
                                            <Star
                                                size={12}
                                                className="text-yellow-500 fill-yellow-500"
                                            />
                                            {dish.rating}
                                        </div>
                                    </div>

                                    {/* Wishlist */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            requireAuth(() => {
                                                if (inWishlist) {
                                                    removeFromWishlist(dish._id);
                                                } else {
                                                    addToWishlist({
                                                        id: dish._id,
                                                        name: dish.name,
                                                        price: dish.price,
                                                        image: dish.image,
                                                    });
                                                }
                                            });
                                        }}
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

                                {/* CONTENT */}
                                <div className="p-5 space-y-4">
                                    <h3 className="font-semibold text-lg">
                                        {dish.name}
                                    </h3>

                                    <p className="text-purple-700 font-bold">
                                        ₹{dish.price}
                                    </p>

                                    {qty === 0 ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                requireAuth(() =>
                                                    addToCart({
                                                        id: dish._id,
                                                        name: dish.name,
                                                        price: dish.price,
                                                        image: dish.image,
                                                    })
                                                );
                                            }}
                                            className="w-full bg-purple-600 text-white py-2 rounded-xl font-medium hover:scale-105 transition"
                                        >
                                            Add
                                        </button>
                                    ) : (
                                        <div
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                            className="flex justify-between items-center bg-purple-600 text-white px-4 py-2 rounded-xl"
                                        >
                                            <button
                                                onClick={() =>
                                                    requireAuth(() =>
                                                        decreaseQty(dish._id)
                                                    )
                                                }
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span>{qty}</span>

                                            <button
                                                onClick={() =>
                                                    requireAuth(() =>
                                                        increaseQty(dish._id)
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

                {/* Dialog remains unchanged */}
            </div>
        </section>
    );
}
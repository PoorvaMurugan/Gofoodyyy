"use client";

import { useState } from "react";
import DishCard, { Dish } from "./DishCard";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Minus, Plus } from "lucide-react";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";

/* ======================
   Full Dish Type
====================== */
interface FullDish extends Dish {
    description: string;
    nutrition: string;
    type: "veg" | "nonveg";
}

type FeaturedDishesSectionProps = {
    data?: {
        title?: string;
        subtitle?: string;
        dishes?: FullDish[];
    };
};

export default function FeaturedDishesSection({
    data,
}: FeaturedDishesSectionProps) {
    const router = useRouter();
    const user = useUser();

    const { cart, addToCart, increaseQty, decreaseQty } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } =
        useWishlist();

    const [selectedDish, setSelectedDish] =
        useState<FullDish | null>(null);
    const [quantity, setQuantity] = useState(1);

    const requireAuth = (action: () => void) => {
        if (!user) {
            router.push("/login");
            return;
        }
        action();
    };

    /* ======================
       FIXED: STRING IDs
    ======================= */
    const fallbackDishes: FullDish[] = [
        {
            id: "dish-1",
            name: "Truffle Mushroom Pizza",
            price: 349,
            rating: 4.7,
            type: "veg",
            description:
                "Premium truffle oil with sautéed mushrooms and mozzarella.",
            nutrition: "Calories: 310 | Protein: 14g",
            image:
                "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
        },
        {
            id: "dish-2",
            name: "Loaded Beef Burger",
            price: 249,
            rating: 4.5,
            type: "nonveg",
            description:
                "Juicy beef patty loaded with cheese and house sauce.",
            nutrition: "Calories: 450 | Protein: 22g",
            image:
                "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
        },
        {
            id: "dish-3",
            name: "Creamy Alfredo Pasta",
            price: 299,
            rating: 4.6,
            type: "veg",
            description:
                "Rich creamy alfredo sauce tossed with fresh herbs.",
            nutrition: "Calories: 360 | Protein: 15g",
            image:
                "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
        },
        {
            id: "dish-4",
            name: "Chocolate Lava Cake",
            price: 199,
            rating: 4.8,
            type: "veg",
            description:
                "Warm chocolate cake with molten lava center.",
            nutrition: "Calories: 280 | Sugar: 18g",
            image:
                "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
        },
    ];

    const dishes = data?.dishes ?? fallbackDishes;

    return (
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {data?.title ?? "Popular Dishes"}
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg">
                        {data?.subtitle ?? "Most loved by our customers"}
                    </p>
                </div>

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {dishes.map((dish) => {
                        const cartItem = cart.find((c) => c.id === dish.id);
                        const qty = cartItem?.quantity || 0;
                        const inWishlist = isInWishlist(dish.id);

                        return (
                            <div key={dish.id} className="relative">
                                <div
                                    className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md ${dish.type === "veg"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }`}
                                >
                                    {dish.type === "veg" ? "Veg" : "Non-Veg"}
                                </div>

                                <button
                                    onClick={() =>
                                        requireAuth(() => {
                                            if (inWishlist) {
                                                removeFromWishlist(dish.id);
                                            } else {
                                                addToWishlist({
                                                    id: dish.id,
                                                    name: dish.name,
                                                    price: dish.price,
                                                    image: dish.image,
                                                });
                                            }
                                        })
                                    }
                                    className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow"
                                >
                                    <Heart
                                        size={18}
                                        className={
                                            inWishlist
                                                ? "text-red-500 fill-red-500"
                                                : "text-gray-400"
                                        }
                                    />
                                </button>

                                <DishCard
                                    dish={dish}
                                    onClick={() => {
                                        setSelectedDish(dish);
                                        setQuantity(1);
                                    }}
                                    onAdd={() =>
                                        requireAuth(() =>
                                            addToCart({
                                                id: dish.id,
                                                name: dish.name,
                                                price: dish.price,
                                                image: dish.image,
                                            })
                                        )
                                    }
                                />

                                {qty > 0 && (
                                    <div className="absolute bottom-4 left-4 right-4 bg-purple-600 text-white flex justify-between items-center px-4 py-2 rounded-xl">
                                        <button
                                            onClick={() =>
                                                requireAuth(() =>
                                                    decreaseQty(dish.id)
                                                )
                                            }
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span>{qty}</span>
                                        <button
                                            onClick={() =>
                                                requireAuth(() =>
                                                    increaseQty(dish.id)
                                                )
                                            }
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Dialog remains same */}
            </div>
        </section>
    );
}
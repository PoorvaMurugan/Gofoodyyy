"use client";

import { useState } from "react";
import DishCard, { Dish } from "./DishCard";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
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

    const { cart, addToCart, increaseQty, decreaseQty } =
        useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } =
        useWishlist();

    const [selectedDish, setSelectedDish] =
        useState<FullDish | null>(null);

    const requireAuth = (action: () => void) => {
        if (!user) {
            router.push("/login");
            return;
        }
        action();
    };

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
            description: "Juicy beef patty loaded with cheese and house sauce.",
            nutrition: "Calories: 450 | Protein: 22g",
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
        },
        {
            id: "dish-3",
            name: "Creamy Alfredo Pasta",
            price: 299,
            rating: 4.6,
            type: "veg",
            description: "Rich creamy alfredo sauce tossed with fresh herbs.",
            nutrition: "Calories: 360 | Protein: 15g",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
        },
        {
            id: "dish-4",
            name: "Chocolate Lava Cake",
            price: 199,
            rating: 4.8,
            type: "veg",
            description: "Warm chocolate cake with molten lava center.",
            nutrition: "Calories: 280 | Sugar: 18g",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
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
                        {data?.subtitle ??
                            "Most loved by our customers"}
                    </p>
                </div>

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {dishes.map((dish) => {
                        const cartItem = cart.find(
                            (c) => c.id === dish.id
                        );
                        const qty = cartItem?.quantity || 0;
                        const inWishlist = isInWishlist(dish.id);

                        return (
                            <div key={dish.id} className="relative">
                                {/* Wishlist */}
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

                                {/* Controlled DishCard */}
                                <DishCard
                                    dish={dish}
                                    quantity={qty}
                                    onClick={() =>
                                        setSelectedDish(dish)
                                    }
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
                                    onIncrease={() =>
                                        requireAuth(() =>
                                            increaseQty(dish.id)
                                        )
                                    }
                                    onDecrease={() =>
                                        requireAuth(() =>
                                            decreaseQty(dish.id)
                                        )
                                    }
                                />

                                {/* View Details */}
                                <p
                                    onClick={() =>
                                        setSelectedDish(dish)
                                    }
                                    className="mt-3 text-sm text-purple-600 underline cursor-pointer hover:text-purple-800"
                                >
                                    View Details
                                </p>
                            </div>
                        );
                    })}
                </div>
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

                                {/* Controlled Quantity in Dialog */}
                                {(() => {
                                    const cartItem = cart.find(
                                        (c) =>
                                            c.id === selectedDish.id
                                    );
                                    const qty =
                                        cartItem?.quantity || 0;

                                    return qty === 0 ? (
                                        <button
                                            onClick={() =>
                                                requireAuth(() =>
                                                    addToCart({
                                                        id: selectedDish.id,
                                                        name: selectedDish.name,
                                                        price:
                                                            selectedDish.price,
                                                        image:
                                                            selectedDish.image,
                                                    })
                                                )
                                            }
                                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold"
                                        >
                                            Add
                                        </button>
                                    ) : (
                                        <div className="flex justify-between items-center bg-purple-600 text-white px-6 py-3 rounded-xl">
                                            <button
                                                onClick={() =>
                                                    decreaseQty(
                                                        selectedDish.id
                                                    )
                                                }
                                            >
                                                <Minus size={18} />
                                            </button>

                                            <span className="text-lg font-semibold">
                                                {qty}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    increaseQty(
                                                        selectedDish.id
                                                    )
                                                }
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
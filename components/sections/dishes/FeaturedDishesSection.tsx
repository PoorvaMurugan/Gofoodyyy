"use client";

import { useState } from "react";
import DishCard, { Dish } from "./DishCard";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

interface FullDish extends Dish {
    description: string;
    nutrition: string;
    type: "veg" | "nonveg";
}

const dishes: FullDish[] = [
    {
        id: 1,
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
        id: 2,
        name: "Loaded Beef Burger",
        price: 249,
        rating: 4.5,
        type: "nonveg",
        description:
            "Juicy beef patty loaded with cheese, lettuce and house sauce.",
        nutrition: "Calories: 450 | Protein: 22g",
        image:
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    },
    {
        id: 3,
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
        id: 4,
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

export default function FeaturedDishesSection() {
    const [selectedDish, setSelectedDish] = useState<FullDish | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleOuterAdd = (dish: Dish, qty: number) => {
        console.log("Outer Card:", dish.name, "Qty:", qty);
    };

    const handleDialogAdd = () => {
        if (!selectedDish) return;
        console.log("Dialog Add:", selectedDish.name, "Qty:", quantity);
        setSelectedDish(null);
    };

    return (
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Popular Dishes
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg">
                        Most loved by our customers
                    </p>
                </div>

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {dishes.map((dish) => (
                        <DishCard
                            key={dish.id}
                            dish={dish}
                            onClick={() => {
                                setSelectedDish(dish);
                                setQuantity(1);
                            }}
                            onAdd={handleOuterAdd}
                        />
                    ))}
                </div>

                {/* DIALOG */}
                <Dialog
                    open={!!selectedDish}
                    onOpenChange={() => setSelectedDish(null)}
                >
                    <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">

                        {selectedDish && (
                            <>
                                <DialogTitle className="sr-only">
                                    {selectedDish.name}
                                </DialogTitle>

                                <div className="relative h-56 w-full">
                                    <Image
                                        src={selectedDish.image}
                                        alt={selectedDish.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="p-6 space-y-4 bg-white">

                                    <h2 className="text-xl font-bold">
                                        {selectedDish.name}
                                    </h2>

                                    <p className="text-gray-600 text-sm">
                                        {selectedDish.description}
                                    </p>

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-4 bg-purple-100 px-4 py-2 rounded-full">
                                            <button
                                                onClick={() =>
                                                    setQuantity((q) => Math.max(1, q - 1))
                                                }
                                            >
                                                -
                                            </button>

                                            <span>{quantity}</span>

                                            <button
                                                onClick={() => setQuantity((q) => q + 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleDialogAdd}
                                            className="bg-purple-600 text-white px-6 py-2 rounded-full"
                                        >
                                            Add ₹{selectedDish.price * quantity}
                                        </button>

                                    </div>
                                </div>
                            </>
                        )}

                    </DialogContent>
                </Dialog>

            </div>
        </section>
    );
}

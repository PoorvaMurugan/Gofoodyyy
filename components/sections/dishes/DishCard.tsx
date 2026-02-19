"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Plus, Minus } from "lucide-react";

export interface Dish {
    id: number;
    name: string;
    price: number;
    rating: number;
    image: string;
}

interface DishCardProps {
    dish: Dish;
    onClick: () => void;
    onAdd: (dish: Dish, quantity: number) => void;
}

export default function DishCard({
    dish,
    onClick,
    onAdd,
}: DishCardProps) {
    const [quantity, setQuantity] = useState(0);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        setQuantity(1);
        onAdd(dish, 1);
    };

    const increase = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newQty = quantity + 1;
        setQuantity(newQty);
        onAdd(dish, newQty);
    };

    const decrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newQty = quantity - 1;

        if (newQty <= 0) {
            setQuantity(0);
            onAdd(dish, 0);
        } else {
            setQuantity(newQty);
            onAdd(dish, newQty);
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
        >
            {/* Image */}
            <div className="relative h-48 w-full">
                <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-5 space-y-2">
                <h3 className="text-lg font-semibold">{dish.name}</h3>

                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>⭐ {dish.rating}</span>
                    <span className="font-semibold text-gray-800">
                        ₹{dish.price}
                    </span>
                </div>

                {/* 🔥 Dynamic Add Button */}
                <div className="mt-4">
                    {quantity === 0 ? (
                        <button
                            onClick={handleAdd}
                            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                        >
                            <ShoppingCart size={18} />
                            Add
                        </button>
                    ) : (
                        <div
                            className="w-full flex items-center justify-between bg-purple-600 text-white py-2 px-4 rounded-xl transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={decrease}>
                                <Minus size={18} />
                            </button>

                            <span className="font-semibold">{quantity}</span>

                            <button onClick={increase}>
                                <Plus size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

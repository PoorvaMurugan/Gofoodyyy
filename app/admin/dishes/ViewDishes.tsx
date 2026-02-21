"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import AddDishForm from "./AddDishForm";

export default function ViewDishes() {
    const dishes = useQuery(api.dishes.getAllDishes);
    const deleteDish = useMutation(api.dishes.deleteDish);
    const toggleAvailability = useMutation(api.dishes.toggleAvailability);

    const [loadingId, setLoadingId] = useState<Id<"dishes"> | null>(null);
    const [editingDish, setEditingDish] = useState<any>(null);

    // ✅ MOVE THIS ABOVE RETURN
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setEditingDish(null);
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleToggle = async (id: Id<"dishes">) => {
        try {
            setLoadingId(id);
            await toggleAvailability({ id });
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id: Id<"dishes">) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this dish?"
        );
        if (!confirmDelete) return;

        await deleteDish({ id });
    };

    // ✅ EARLY RETURN AFTER ALL HOOKS
    if (!dishes) {
        return <p className="text-center mt-10">Loading dishes...</p>;
    }

    return (
        <div className="space-y-8">
            {dishes.length === 0 && (
                <p className="text-center text-gray-500">
                    No dishes available.
                </p>
            )}

            {dishes.map((dish) => (
                <div
                    key={dish._id}
                    className="bg-white p-6 rounded-2xl shadow-lg flex gap-6 hover:shadow-2xl transition"
                >
                    <Image
                        src={dish.image}
                        alt={dish.name}
                        width={180}
                        height={180}
                        className="rounded-xl object-cover"
                    />

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">
                            {dish.name}
                        </h2>

                        <p>Category: {dish.category}</p>
                        <p>Price: ₹{dish.price}</p>
                        <p>Rating: {dish.rating}</p>
                        <p>Type: {dish.type}</p>

                        <p
                            className={`mt-3 font-semibold ${dish.isAvailable
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {dish.isAvailable
                                ? "Available"
                                : "Out of Stock"}
                        </p>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => handleToggle(dish._id)}
                                disabled={loadingId === dish._id}
                                className="px-4 py-2 bg-yellow-300 rounded-lg hover:scale-105 transition cursor-pointer"
                            >
                                {loadingId === dish._id
                                    ? "Updating..."
                                    : "Toggle Stock"}
                            </button>

                            <button
                                onClick={() => setEditingDish(dish)}
                                className="px-4 py-2 bg-blue-300 rounded-lg hover:scale-105 transition cursor-pointer"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(dish._id)}
                                className="px-4 py-2 bg-red-300 rounded-lg hover:scale-105 transition cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {editingDish && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setEditingDish(null)}
                >
                    <div
                        className="w-[900px] max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AddDishForm
                            editData={editingDish}
                            onClose={() => setEditingDish(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminDishes() {
    const addDish = useMutation(api.dishes.addDish);

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        serving: "",
        rating: "",
        image: "",
        description: "",
        nutrition: "",
        type: "veg",
    });

    const handleSubmit = async () => {
        await addDish({
            name: form.name,
            category: form.category,
            price: Number(form.price),
            serving: form.serving,
            rating: Number(form.rating),
            image: form.image,
            description: form.description,
            nutrition: form.nutrition,
            type: form.type as "veg" | "nonveg",
        });

        alert("Dish added successfully!");

        setForm({
            name: "",
            category: "",
            price: "",
            serving: "",
            rating: "",
            image: "",
            description: "",
            nutrition: "",
            type: "veg",
        });
    };

    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-3xl font-bold mb-6">Add New Dish</h1>

            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 w-full"
            />

            <input
                placeholder="Category (Pizza/Burger/etc)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border p-2 w-full"
            />

            <input
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border p-2 w-full"
            />

            <input
                placeholder="Serving"
                value={form.serving}
                onChange={(e) => setForm({ ...form, serving: e.target.value })}
                className="border p-2 w-full"
            />

            <input
                placeholder="Rating"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="border p-2 w-full"
            />

            <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="border p-2 w-full"
            />

            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                }
                className="border p-2 w-full"
            />

            <input
                placeholder="Nutrition"
                value={form.nutrition}
                onChange={(e) =>
                    setForm({ ...form, nutrition: e.target.value })
                }
                className="border p-2 w-full"
            />

            <select
                value={form.type}
                onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                }
                className="border p-2 w-full"
            >
                <option value="veg">Veg</option>
                <option value="nonveg">Non-Veg</option>
            </select>

            <button
                onClick={handleSubmit}
                className="bg-orange-500 text-white px-4 py-2 rounded"
            >
                Add Dish
            </button>
        </div>
    );
}
"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Star, Plus, Minus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

interface Dish {
    id: number;
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
const allDishes: Dish[] = [
    // 🍕 PIZZA (4)
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 299,
        serving: "Serves 2",
        rating: 4.6,
        type: "veg",
        description: "Classic pizza topped with mozzarella cheese and basil.",
        nutrition: "Calories: 280 | Protein: 12g | Carbs: 35g",
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 349,
        serving: "Serves 2",
        rating: 4.5,
        type: "nonveg",
        description: "Spicy pepperoni with extra mozzarella.",
        nutrition: "Calories: 320 | Protein: 15g | Carbs: 38g",
        image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80",
    },
    {
        id: 3,
        name: "Farmhouse Pizza",
        category: "Pizza",
        price: 379,
        serving: "Serves 3",
        rating: 4.7,
        type: "veg",
        description: "Loaded with veggies and fresh cheese.",
        nutrition: "Calories: 300 | Protein: 13g | Carbs: 40g",
        image: "https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=800&q=80",
    },
    {
        id: 4,
        name: "BBQ Chicken Pizza",
        category: "Pizza",
        price: 399,
        serving: "Serves 3",
        rating: 4.4,
        type: "nonveg",
        description: "BBQ sauce with juicy chicken toppings.",
        nutrition: "Calories: 350 | Protein: 20g | Carbs: 42g",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    },

    // 🍔 BURGER (4)
    {
        id: 5,
        name: "Classic Burger",
        category: "Burger",
        price: 249,
        serving: "Serves 1",
        rating: 4.3,
        type: "nonveg",
        description: "Juicy beef patty with cheese and lettuce.",
        nutrition: "Calories: 400 | Protein: 18g | Carbs: 45g",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    },
    {
        id: 6,
        name: "Double Patty Burger",
        category: "Burger",
        price: 299,
        serving: "Serves 1",
        rating: 4.6,
        type: "nonveg",
        description: "Double layered patties with melted cheese.",
        nutrition: "Calories: 520 | Protein: 25g | Carbs: 50g",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    },
    {
        id: 7,
        name: "Veg Supreme Burger",
        category: "Burger",
        price: 219,
        serving: "Serves 1",
        rating: 4.5,
        type: "veg",
        description: "Crispy veg patty with fresh veggies.",
        nutrition: "Calories: 380 | Protein: 12g | Carbs: 48g",
        image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&q=80",
    },
    {
        id: 8,
        name: "BBQ Bacon Burger",
        category: "Burger",
        price: 329,
        serving: "Serves 1",
        rating: 4.7,
        type: "nonveg",
        description: "Smoky bacon with BBQ sauce.",
        nutrition: "Calories: 550 | Protein: 28g | Carbs: 52g",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80",
    },

    // 🍝 PASTA (4)
    {
        id: 9,
        name: "White Sauce Pasta",
        category: "Pasta",
        price: 279,
        serving: "Serves 1",
        rating: 4.5,
        type: "veg",
        description: "Creamy white sauce pasta.",
        nutrition: "Calories: 350 | Protein: 14g | Carbs: 42g",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    },
    {
        id: 10,
        name: "Red Sauce Pasta",
        category: "Pasta",
        price: 259,
        serving: "Serves 1",
        rating: 4.4,
        type: "veg",
        description: "Tangy tomato pasta.",
        nutrition: "Calories: 330 | Protein: 12g | Carbs: 40g",
        image: "https://images.unsplash.com/photo-1589307004394-3d6a9f1d41e3?w=800&q=80",
    },
    {
        id: 11,
        name: "Alfredo Pasta",
        category: "Pasta",
        price: 299,
        serving: "Serves 1",
        rating: 4.7,
        type: "veg",
        description: "Rich creamy Alfredo sauce.",
        nutrition: "Calories: 380 | Protein: 16g | Carbs: 44g",
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    },
    {
        id: 12,
        name: "Pesto Pasta",
        category: "Pasta",
        price: 289,
        serving: "Serves 1",
        rating: 4.6,
        type: "veg",
        description: "Fresh basil pesto pasta.",
        nutrition: "Calories: 360 | Protein: 15g | Carbs: 41g",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80",
    },

    // 🥤 DRINKS (4)
    {
        id: 13,
        name: "Cold Coffee",
        category: "Drinks",
        price: 149,
        serving: "300ml",
        rating: 4.4,
        type: "veg",
        description: "Chilled creamy cold coffee.",
        nutrition: "Calories: 180 | Sugar: 20g",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
    },
    {
        id: 14,
        name: "Fresh Lime Soda",
        category: "Drinks",
        price: 99,
        serving: "250ml",
        rating: 4.3,
        type: "veg",
        description: "Refreshing lime soda.",
        nutrition: "Calories: 120 | Sugar: 15g",
        image: "https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=800&q=80",
    },
    {
        id: 15,
        name: "Milkshake",
        category: "Drinks",
        price: 169,
        serving: "350ml",
        rating: 4.6,
        type: "veg",
        description: "Thick creamy milkshake.",
        nutrition: "Calories: 250 | Protein: 8g",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80",
    },
    {
        id: 16,
        name: "Iced Tea",
        category: "Drinks",
        price: 129,
        serving: "300ml",
        rating: 4.5,
        type: "veg",
        description: "Cool refreshing iced tea.",
        nutrition: "Calories: 90 | Sugar: 10g",
        image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800&q=80",
    },
];

export default function MenuPage() {
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
    const [quantity, setQuantity] = useState(1);

    // 🔥 Track quantities per dish (important)
    const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});

    const categories = [...new Set(allDishes.map((d) => d.category))];

    const increaseQty = (dishId: number) => {
        setCartQuantities((prev) => ({
            ...prev,
            [dishId]: (prev[dishId] || 0) + 1,
        }));
    };

    const decreaseQty = (dishId: number) => {
        setCartQuantities((prev) => {
            const current = prev[dishId] || 0;
            if (current <= 1) {
                const updated = { ...prev };
                delete updated[dishId];
                return updated;
            }
            return { ...prev, [dishId]: current - 1 };
        });
    };

    return (
        <section className="py-16 md:py-20 bg-purple-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">

                <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700">
                    Taste a wide variety of dishes
                </h1>

                {categories.map((category) => {
                    const filtered = allDishes.filter(
                        (dish) => dish.category === category
                    );

                    return (
                        <div key={category}>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 border-l-4 border-purple-600 pl-4">
                                {category}
                            </h2>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {filtered.map((dish) => {
                                    const qty = cartQuantities[dish.id] || 0;

                                    return (
                                        <div
                                            key={dish.id}
                                            onClick={() => {
                                                setSelectedDish(dish);
                                                setQuantity(1);
                                            }}
                                            className="cursor-pointer bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-purple-300/40 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] flex flex-col group"
                                        >
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <Image
                                                    src={dish.image}
                                                    alt={dish.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 group-hover:rotate-1 transition duration-700"
                                                />

                                                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow">
                                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                    {dish.rating}
                                                </div>
                                            </div>

                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800">
                                                    {dish.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {dish.serving}
                                                </p>
                                                <p className="text-purple-700 font-bold mt-3 text-lg">
                                                    ₹{dish.price}
                                                </p>

                                                {/* 🔥 ADD BUTTON WITH QUANTITY SELECTOR */}
                                                <div className="mt-4">
                                                    {qty === 0 ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                increaseQty(dish.id);
                                                            }}
                                                            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                                                        >
                                                            <ShoppingCart size={18} />
                                                            Add
                                                        </button>
                                                    ) : (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full flex items-center justify-between bg-purple-600 text-white py-2 px-4 rounded-xl"
                                                        >
                                                            <button onClick={() => decreaseQty(dish.id)}>
                                                                <Minus size={18} />
                                                            </button>

                                                            <span className="font-semibold">{qty}</span>

                                                            <button onClick={() => increaseQty(dish.id)}>
                                                                <Plus size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* DIALOG (unchanged from your original) */}
                <Dialog open={!!selectedDish} onOpenChange={() => setSelectedDish(null)}>
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

                                    <p className="text-sm text-gray-500">
                                        {selectedDish.nutrition}
                                    </p>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </section>
    );
}

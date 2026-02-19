"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
    const {
        cart,
        increaseQty,
        decreaseQty,
        removeItem,
        totalPrice,
    } = useCart();

    return (
        <section className="min-h-screen bg-purple-50 py-16 px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-purple-700 mb-8">
                    Your Cart
                </h1>

                {cart.length === 0 ? (
                    <div className="text-center space-y-4">
                        <p className="text-gray-500">Your cart is empty 🛒</p>
                        <Link
                            href="/menu"
                            className="bg-purple-600 text-white px-6 py-2 rounded-xl"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border-b pb-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {item.name}
                                            </h3>
                                            <p className="text-purple-700 font-bold">
                                                ₹{item.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">

                                        {/* Quantity */}
                                        <div className="flex items-center gap-3 bg-purple-100 px-4 py-2 rounded-full">
                                            <button onClick={() => decreaseQty(item.id)}>
                                                <Minus size={18} />
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button onClick={() => increaseQty(item.id)}>
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:scale-110 transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total Section */}
                        <div className="mt-10 border-t pt-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Total:
                            </h2>

                            <span className="text-2xl font-bold text-purple-700">
                                ₹{totalPrice}
                            </span>
                        </div>

                        <button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:scale-105 transition">
                            Proceed to Checkout
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}

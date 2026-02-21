"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const {
        cart,
        increaseQty,
        decreaseQty,
        removeItem,
        totalPrice,
    } = useCart();

    const router = useRouter();

    const deliveryFee = totalPrice > 499 ? 0 : 40;
    const tax = Math.round(totalPrice * 0.05);
    const grandTotal = totalPrice + deliveryFee + tax;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        console.log("Navigating to checkout...");
        router.push("/checkout");
    };

    return (
        <section className="min-h-screen bg-purple-50 pt-28 pb-16 px-6">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-10">
                    Your Cart
                </h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-lg p-12 text-center space-y-6">
                        <p className="text-gray-500 text-lg">
                            Your cart is empty 🛒
                        </p>

                        <Link
                            href="/menu"
                            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-10">

                        {/* LEFT - CART ITEMS */}
                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8 space-y-8">

                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden">
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

                                            <p className="text-gray-500 text-sm">
                                                ₹{item.price} × {item.quantity}
                                            </p>

                                            <p className="text-purple-700 font-bold mt-1">
                                                ₹{item.price * item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mt-4 sm:mt-0">

                                        {/* Quantity */}
                                        <div className="flex items-center gap-3 bg-purple-100 px-4 py-2 rounded-full">
                                            <button onClick={() => decreaseQty(item.id)}>
                                                <Minus size={18} />
                                            </button>

                                            <span className="font-medium">
                                                {item.quantity}
                                            </span>

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

                        {/* RIGHT - SUMMARY */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 h-fit sticky top-28 space-y-6">

                            <h2 className="text-xl font-semibold">
                                Order Summary
                            </h2>

                            <div className="space-y-4 text-gray-600">

                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span>
                                        {deliveryFee === 0 ? (
                                            <span className="text-green-600 font-medium">
                                                Free
                                            </span>
                                        ) : (
                                            `₹${deliveryFee}`
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>GST (5%)</span>
                                    <span>₹{tax}</span>
                                </div>

                                <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-800">
                                    <span>Total</span>
                                    <span className="text-purple-700">
                                        ₹{grandTotal}
                                    </span>
                                </div>

                            </div>

                            {deliveryFee > 0 && (
                                <p className="text-sm text-gray-500">
                                    Add ₹{499 - totalPrice} more to get free delivery 🚚
                                </p>
                            )}

                            {/* ✅ WORKING BUTTON */}
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
                            >
                                Proceed to Checkout
                            </button>

                        </div>

                    </div>
                )}

            </div>
        </section>
    );
}
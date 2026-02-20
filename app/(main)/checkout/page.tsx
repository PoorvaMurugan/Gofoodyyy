"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useOrders } from "@/context/OrderContext";

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const { placeOrder } = useOrders(); // ✅ IMPORTANT
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [errors, setErrors] = useState<string | null>(null);

    // Redirect if cart empty
    useEffect(() => {
        if (cart.length === 0) {
            router.push("/menu");
        }
    }, [cart, router]);

    const validateForm = () => {
        if (!name.trim()) return "Name is required";
        if (!phone.trim()) return "Phone number is required";
        if (!/^[0-9]{10}$/.test(phone))
            return "Phone number must be 10 digits";
        if (!address.trim()) return "Address is required";
        return null;
    };

    const handlePlaceOrder = () => {
        const validationError = validateForm();

        if (validationError) {
            setErrors(validationError);
            return;
        }

        // ✅ SAVE ORDER TO CONTEXT
        placeOrder(cart, totalPrice);

        // Clear cart
        clearCart();

        // Redirect to Orders page
        router.push("/orders");
    };

    return (
        <div className="min-h-screen bg-purple-50 py-16 px-6">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-lg space-y-8">

                <h1 className="text-3xl font-bold text-purple-700">
                    Checkout
                </h1>

                {/* CUSTOMER DETAILS */}
                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Delivery Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                            rows={3}
                        />
                    </div>

                </div>

                {errors && (
                    <p className="text-red-500 text-sm">
                        {errors}
                    </p>
                )}

                {/* ORDER SUMMARY */}
                <div className="border-t pt-6 space-y-2">
                    <h2 className="font-semibold">Order Summary</h2>

                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>
                                {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}

                    <div className="flex justify-between font-semibold pt-4 border-t">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
                >
                    Confirm Order
                </button>

            </div>
        </div>
    );
}
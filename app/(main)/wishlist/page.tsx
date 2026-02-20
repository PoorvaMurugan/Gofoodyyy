"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Minus, Plus, Trash2, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { cart, addToCart, increaseQty, decreaseQty } = useCart();

    return (
        <section className="min-h-screen bg-purple-50 pt-28 pb-16 px-6">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-purple-700 mb-8 flex items-center gap-3">
                    <Heart className="text-red-500 fill-red-500" />
                    Your Wishlist
                </h1>

                {wishlist.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                        <p className="text-gray-500 text-lg">
                            Your wishlist is empty 💔
                        </p>

                        <Link
                            href="/menu"
                            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                        >
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                        {wishlist.map((item) => {
                            const cartItem = cart.find((c) => c.id === item.id);
                            const qty = cartItem?.quantity || 0;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="relative h-52 w-full">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1 space-y-3">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {item.name}
                                        </h3>

                                        <p className="text-purple-700 font-bold text-lg">
                                            ₹{item.price}
                                        </p>

                                        {/* Dynamic Cart Button */}
                                        <div className="mt-auto flex gap-3">

                                            {qty === 0 ? (
                                                <button
                                                    onClick={() =>
                                                        addToCart({
                                                            id: item.id,
                                                            name: item.name,
                                                            price: item.price,
                                                            image: item.image,
                                                        })
                                                    }
                                                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-xl font-medium hover:bg-purple-700 transition"
                                                >
                                                    <ShoppingCart size={18} />
                                                    Add to Cart
                                                </button>
                                            ) : (
                                                <div className="flex-1 flex items-center justify-between bg-purple-600 text-white py-2 px-4 rounded-xl">
                                                    <button onClick={() => decreaseQty(item.id)}>
                                                        <Minus size={18} />
                                                    </button>

                                                    <span className="font-semibold">{qty}</span>

                                                    <button onClick={() => increaseQty(item.id)}>
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Remove Wishlist */}
                                            <button
                                                onClick={() => removeFromWishlist(item.id)}
                                                className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </section>
    );
}
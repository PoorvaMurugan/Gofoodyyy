"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/* =========================
   Cart Item (STRING ID)
========================= */
export interface CartItem {
    id: string;   // ✅ changed from number → string
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    increaseQty: (id: string) => void;   // ✅ string
    decreaseQty: (id: string) => void;   // ✅ string
    removeItem: (id: string) => void;    // ✅ string
    clearCart: () => void;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    /* =========================
       Add To Cart
    ========================= */
    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);

            if (existing) {
                return prev.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            return [...prev, { ...item, quantity: 1 }];
        });
    };

    /* =========================
       Increase Quantity
    ========================= */
    const increaseQty = (id: string) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    /* =========================
       Decrease Quantity
    ========================= */
    const decreaseQty = (id: string) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    /* =========================
       Remove Item
    ========================= */
    const removeItem = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    /* =========================
       Clear Cart
    ========================= */
    const clearCart = () => {
        setCart([]);
    };

    /* =========================
       Total Price
    ========================= */
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increaseQty,
                decreaseQty,
                removeItem,
                clearCart,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context)
        throw new Error("useCart must be used inside CartProvider");
    return context;
}
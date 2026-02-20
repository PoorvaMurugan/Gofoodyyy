"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/* =========================
   Wishlist Item (STRING ID)
========================= */
export interface WishlistItem {
    id: string;   // ✅ changed from number → string
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;   // ✅ string
    isInWishlist: (id: string) => boolean;      // ✅ string
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

    /* =========================
       Add To Wishlist
    ========================= */
    const addToWishlist = (item: WishlistItem) => {
        setWishlist((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            if (exists) return prev;
            return [...prev, item];
        });
    };

    /* =========================
       Remove From Wishlist
    ========================= */
    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    /* =========================
       Check If Exists
    ========================= */
    const isInWishlist = (id: string) => {
        return wishlist.some((item) => item.id === id);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context)
        throw new Error("useWishlist must be used inside WishlistProvider");
    return context;
}
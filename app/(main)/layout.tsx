"use client";

import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthSync } from "@/components/authsync";
import { OrderProvider } from "@/context/OrderContext";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <OrderProvider>
                <WishlistProvider>
                    <AuthSync />
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                </WishlistProvider>
            </OrderProvider>
        </CartProvider>
    );
}
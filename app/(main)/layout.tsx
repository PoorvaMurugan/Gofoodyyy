"use client";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthSync } from "@/components/authsync";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext"; // ✅ import this

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <CartProvider> {/* ✅ Wrap entire app here */}
            <AuthSync />
            <Navbar />
            <main>{children}</main>
            <Footer />
        </CartProvider>
    );
}

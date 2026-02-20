"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        // 🔐 Replace with your admin email
        if (user.primaryEmail !== "muruganpoorva@gmail.com") {
            router.push("/");
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-8">
                    Admin Panel
                </h2>

                <nav className="space-y-4 text-lg">
                    <Link href="/admin" className="block hover:text-orange-500 transition">
                        Dashboard
                    </Link>
                    <Link href="/admin/dishes" className="block hover:text-orange-500 transition">
                        Dishes
                    </Link>
                    <Link href="/admin/orders" className="block hover:text-orange-500 transition">
                        Orders
                    </Link>
                    <Link href="/admin/users" className="block hover:text-orange-500 transition">
                        Users
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
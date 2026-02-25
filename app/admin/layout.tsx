"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    LayoutDashboard,
    Utensils,
    ShoppingCart,
    Users,
    LogOut,
    ChevronDown,
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user: any = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Extract email safely
    const email =
        user?.email ||
        user?.primaryEmail ||
        user?.primaryEmailAddress?.email ||
        user?.emails?.[0]?.email ||
        null;

    // Fetch user from Convex
    const convexUser = useQuery(
        api.users.getUserByEmail,
        email ? { email } : "skip"
    );

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (convexUser && convexUser.role !== "admin") {
            router.push("/");
        }
    }, [user, convexUser, router]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user || !convexUser) return null;
    if (convexUser.role !== "admin") return null;

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
        { name: "Dishes", href: "/admin/dishes", icon: <Utensils size={18} /> },
        { name: "Orders", href: "/admin/orders", icon: <ShoppingCart size={18} /> },
        { name: "Users", href: "/admin/users", icon: <Users size={18} /> },
    ];

    return (
        <div className="flex h-screen bg-violet-50 overflow-hidden">
            {/* Fixed Sidebar */}
            <aside className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between fixed h-screen">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#7C3AED] mb-10 tracking-wide">
                        GoFoody Admin
                    </h2>

                    <nav className="space-y-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                                            ? "bg-violet-100 text-[#7C3AED] font-semibold shadow-sm"
                                            : "text-gray-600 hover:bg-violet-50 hover:text-[#7C3AED]"
                                        }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()} GoFoody
                </div>
            </aside>

            {/* Main Section */}
            <div className="flex-1 flex flex-col ml-64 h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">
                        Admin Dashboard
                    </h1>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-3 focus:outline-none"
                        >
                            <div className="w-10 h-10 bg-[#7C3AED] text-white flex items-center justify-center rounded-full font-bold">
                                {convexUser.name.charAt(0).toUpperCase()}
                            </div>
                            <ChevronDown size={16} />
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {convexUser.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{email}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        user?.signOut?.();
                                        router.push("/login");
                                    }}
                                    className="w-full flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
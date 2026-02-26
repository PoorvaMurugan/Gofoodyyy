"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
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

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user: any = useUser();
    const router = useRouter();
    const pathname = usePathname();

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

    if (!user || !convexUser) return null;
    if (convexUser.role !== "admin") return null;

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
        { name: "Dishes", href: "/admin/dishes", icon: <Utensils size={18} /> },
        { name: "Orders", href: "/admin/orders", icon: <ShoppingCart size={18} /> },
        { name: "Users", href: "/admin/users", icon: <Users size={18} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between fixed h-screen">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">
                        GoFoody Admin
                    </h2>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                    ${isActive
                                            ? "bg-gray-100 text-gray-900 font-medium"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Admin Dashboard
                    </h1>

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-900 text-white flex items-center justify-center rounded-full font-semibold text-sm">
                                    {convexUser.name.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={16} className="text-gray-600" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">
                                        {convexUser.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {email}
                                    </span>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => {
                                    user?.signOut?.();
                                    router.push("/login");
                                }}
                            >
                                <LogOut size={16} className="mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useStackApp } from "@stackframe/stack";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCart, Menu, X } from "lucide-react";

export function Navbar() {
    const user = useUser();
    const stackApp = useStackApp();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const initials =
        user.displayName?.charAt(0).toUpperCase() ||
        user.primaryEmail?.charAt(0).toUpperCase() ||
        "U";

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6 md:px-10">

                {/* LEFT - LOGO */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.svg"
                        alt="gofoodyyy"
                        width={40}
                        height={40}
                    />
                    <span className="text-2xl md:text-3xl font-bold text-purple-700">
                        gofoodyyy
                    </span>
                </Link>

                {/* CENTER NAV (Desktop) */}
                <nav className="hidden md:flex items-center gap-12 absolute left-1/2 transform -translate-x-1/2">
                    <NavItem href="/menu" label="Menu" />
                    <NavItem
                        href="/cart"
                        label="Cart"
                        icon={<ShoppingCart size={20} />}
                    />
                    <NavItem href="/orders" label="Orders" />
                </nav>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4">

                    {/* MOBILE HAMBURGER */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>

                    {/* PROFILE AVATAR */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button>
                                <Avatar className="h-10 w-10 shadow-md">
                                    <AvatarFallback className="text-lg font-semibold bg-purple-100 text-purple-700">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>
                                {user.primaryEmail}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => stackApp.signOut()}
                                className="text-red-500 cursor-pointer"
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden bg-white border-t shadow-sm">
                    <div className="flex flex-col items-center gap-6 py-6">
                        <NavItem href="/menu" label="Menu" />
                        <NavItem
                            href="/cart"
                            label="Cart"
                            icon={<ShoppingCart size={20} />}
                        />
                        <NavItem href="/orders" label="Orders" />
                    </div>
                </div>
            )}
        </header>
    );
}

/* NAV ITEM */
function NavItem({
    href,
    label,
    icon,
}: {
    href: string;
    label: string;
    icon?: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="relative flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-purple-700 transition group"
        >
            {icon}
            {label}

            <span className="absolute left-0 -bottom-2 h-[3px] w-0 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
    );
}

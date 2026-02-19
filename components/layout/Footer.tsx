"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-purple-100 to-purple-200 pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Grid */}
                <div className="grid gap-12 md:grid-cols-4">

                    {/* Brand */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-purple-700">
                            gofoodyyy
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Delivering delicious meals with love and speed.
                            Fresh ingredients, hygienic preparation, and
                            lightning-fast delivery at your doorstep.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li><Link href="/menu" className="hover:text-purple-700 transition">Menu</Link></li>
                            <li><Link href="/orders" className="hover:text-purple-700 transition">Orders</Link></li>
                            <li><Link href="/cart" className="hover:text-purple-700 transition">Cart</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Contact
                        </h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            <li>Email: support@gofoodyyy.com</li>
                            <li>Phone: +91 98765 43210</li>
                            <li>Location: Chennai, India</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Subscribe
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Get special offers & updates.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full px-4 py-2 rounded-l-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button className="bg-purple-600 text-white px-5 py-2 rounded-r-full hover:bg-purple-700 transition">
                                Join
                            </button>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-6 text-purple-700">
                            <Facebook className="hover:scale-110 transition cursor-pointer" />
                            <Instagram className="hover:scale-110 transition cursor-pointer" />
                            <Twitter className="hover:scale-110 transition cursor-pointer" />
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-purple-300 mt-12 pt-6 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} gofoodyyy. All rights reserved.
                </div>

            </div>
        </footer>
    );
}

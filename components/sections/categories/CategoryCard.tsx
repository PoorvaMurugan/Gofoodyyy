"use client";

import Link from "next/link";
import Image from "next/image";

export interface Category {
    name: string;
    image: string;
}

export default function CategoryCard({
    category,
}: {
    category: Category;
}) {
    return (
        <Link
            href={`/menu?category=${category.name}`}
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
            {/* IMAGE */}
            <div className="relative h-52 w-full overflow-hidden">
                <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </div>

            {/* Purple Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-purple-800/40 to-transparent opacity-80 group-hover:opacity-90 transition duration-500"></div>

            {/* TEXT */}
            <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-xl font-semibold tracking-wide">
                    {category.name}
                </h3>
            </div>

            {/* Glow Border Effect */}
            <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-purple-500/50 transition duration-500"></div>
        </Link>
    );
}

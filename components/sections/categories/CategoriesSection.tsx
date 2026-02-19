"use client";

import CategoryCard, { Category } from "./CategoryCard";

const categories: Category[] = [
    {
        name: "Pizza",
        image:
            "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
    },
    {
        name: "Burger",
        image:
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    },
    {
        name: "Pasta",
        image:
            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    },
    {
        name: "Drinks",
        image:
            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80",
    },
    {
        name: "Desserts",
        image:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    },
];

export default function CategoriesSection() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Title */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Explore Categories
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg">
                        Choose your favorite delicious meals
                    </p>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-8">
                    {categories.map((category) => (
                        <CategoryCard key={category.name} category={category} />
                    ))}
                </div>

                {/* Mobile Horizontal Scroll */}
                <div className="md:hidden flex gap-6 overflow-x-auto pb-4">
                    {categories.map((category) => (
                        <div key={category.name} className="min-w-[220px]">
                            <CategoryCard category={category} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

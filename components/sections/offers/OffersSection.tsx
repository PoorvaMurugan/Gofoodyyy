"use client";

import OfferCard from "./OfferCard";

const offers = [
    {
        title: "Get 30% Off on Pizzas",
        description:
            "Enjoy wood-fired pizzas with crispy crust and cheesy toppings at special discounted prices.",
        image:
            "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=1200&q=80",
    },
    {
        title: "Free Dessert on Orders Above ₹599",
        description:
            "Order your favorite meals and get a complimentary dessert absolutely free.",
        image:
            "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=80",
    },
];

export default function OffersSection() {
    return (
        <section className="py-20 bg-purple-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Title */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Special Offers
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg">
                        Don’t miss these exciting deals
                    </p>
                </div>

                {/* Grid */}
                <div className="grid gap-10 lg:grid-cols-2">
                    {offers.map((offer, index) => (
                        <OfferCard key={index} offer={offer} />
                    ))}
                </div>

            </div>
        </section>
    );
}

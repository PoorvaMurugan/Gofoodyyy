"use client";

import Image from "next/image";

interface Offer {
    title: string;
    description: string;
    image: string;
}

export default function OfferCard({ offer }: { offer: Offer }) {
    return (
        <div className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">

            {/* Background Image */}
            <div className="relative h-64 w-full">
                <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </div>

            {/* Purple Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-transparent"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white space-y-4">
                <span className="bg-white/20 backdrop-blur-md w-fit px-4 py-1 rounded-full text-sm font-medium">
                    Limited Offer
                </span>

                <h3 className="text-2xl md:text-3xl font-bold">
                    {offer.title}
                </h3>

                <p className="text-sm md:text-base text-purple-100 max-w-md">
                    {offer.description}
                </p>

                <button className="mt-2 w-fit bg-white text-purple-700 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition duration-300 shadow-md">
                    Order Now
                </button>
            </div>
        </div>
    );
}

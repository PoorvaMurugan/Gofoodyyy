"use client";

import { ReactNode } from "react";

export interface Feature {
    icon: ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({
    feature,
}: {
    feature: Feature;
}) {
    return (
        <div className="group bg-white rounded-3xl p-8 text-center shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">

            {/* Purple Glow Background */}
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative z-10 space-y-4">

                {/* Icon */}
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition duration-500">
                    {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-700 transition">
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                </p>

            </div>
        </div>
    );
}
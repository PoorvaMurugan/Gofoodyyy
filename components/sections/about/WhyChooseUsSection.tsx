"use client";

import FeatureCard, { Feature } from "./FeatureCard";
import { Clock, ShieldCheck, Truck, Star } from "lucide-react";

type WhyChooseUsSectionProps = {
    data?: {
        title?: string;
        subtitle?: string;
        features?: Feature[];
    };
};

export default function WhyChooseUsSection({
    data,
}: WhyChooseUsSectionProps) {

    // Fallback static features (until admin connects real data)
    const fallbackFeatures: Feature[] = [
        {
            icon: <Clock size={28} />,
            title: "Fast Delivery",
            description:
                "Get your favorite meals delivered hot and fresh within minutes.",
        },
        {
            icon: <ShieldCheck size={28} />,
            title: "Hygienic & Safe",
            description:
                "Prepared with strict hygiene standards and quality ingredients.",
        },
        {
            icon: <Truck size={28} />,
            title: "Live Order Tracking",
            description:
                "Track your order in real-time from kitchen to your doorstep.",
        },
        {
            icon: <Star size={28} />,
            title: "Top Rated Dishes",
            description:
                "Loved by thousands of happy customers every single day.",
        },
    ];

    const features = data?.features ?? fallbackFeatures;

    return (
        <section className="py-20 bg-gradient-to-b from-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {data?.title ?? "Why Choose gofoodyyy?"}
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg">
                        {data?.subtitle ?? "We deliver happiness along with your food"}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                </div>

            </div>
        </section>
    );
}
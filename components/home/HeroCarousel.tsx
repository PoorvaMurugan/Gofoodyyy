"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type HeroCarouselProps = {
    data: any; // temporary typing (we will strongly type later)
};

export default function HeroCarousel({ data }: HeroCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    // Temporary static slides (will replace with data later)
    const slides = [
        {
            id: 1,
            image:
                "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
            title: "Authentic South Indian Delights",
            subtitle: "Hot • Fresh • Delivered Fast",
        },
        {
            id: 2,
            image:
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
            title: "Wood Fired Pizzas",
            subtitle: "Crispy • Cheesy • Irresistible",
        },
        {
            id: 3,
            image:
                "https://images.unsplash.com/photo-1550547660-d9450f859349",
            title: "Signature Burgers",
            subtitle: "Juicy • Loaded • Delicious",
        },
    ];

    const autoPlay = useCallback(() => {
        if (!emblaApi) return;

        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [emblaApi]);

    useEffect(() => {
        const cleanup = autoPlay();
        return cleanup;
    }, [autoPlay]);

    return (
        <section className="relative w-full h-[85vh] md:h-screen overflow-hidden">
            <div ref={emblaRef} className="overflow-hidden h-full">
                <div className="flex h-full">
                    {slides.map((slide) => (
                        <div key={slide.id} className="relative min-w-full h-full">

                            {/* Background Image */}
                            <Image
                                src={`${slide.image}?w=1920&q=80`}
                                alt={slide.title}
                                fill
                                priority
                                className="object-cover"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80" />

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">

                                <motion.h1
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
                                >
                                    {slide.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="text-lg md:text-2xl text-gray-200 mb-10"
                                >
                                    {slide.subtitle}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        href="/menu"
                                        className="bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Order Now
                                    </Link>
                                </motion.div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
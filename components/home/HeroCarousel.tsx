"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const slides = [
    {
        image:
            "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
        title: "Authentic South Indian Delights",
        subtitle: "Hot • Fresh • Delivered Fast",
    },
    {
        image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
        title: "Wood Fired Pizzas",
        subtitle: "Crispy • Cheesy • Irresistible",
    },
    {
        image:
            "https://images.unsplash.com/photo-1550547660-d9450f859349",
        title: "Signature Burgers",
        subtitle: "Juicy • Loaded • Delicious",
    },
];

export default function HeroCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    // Auto Slide
    useEffect(() => {
        if (!emblaApi) return;

        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, 4000);

        return () => clearInterval(interval);
    }, [emblaApi]);

    return (
        <section className="relative w-full h-screen overflow-hidden">
            <div ref={emblaRef} className="overflow-hidden h-full">
                <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="relative min-w-full h-full"
                        >
                            {/* Background Image */}
                            <img
                                src={slide.image}
                                alt="Hero"
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Premium Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/80" />

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6 pt-28">

                                <motion.h1
                                    key={slide.title}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-4xl md:text-6xl font-bold mb-4"
                                >
                                    {slide.title}
                                </motion.h1>

                                <motion.p
                                    key={slide.subtitle}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-lg md:text-xl mb-8"
                                >
                                    {slide.subtitle}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1 }}
                                >
                                    <Link
                                        href="/menu"
                                        className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/40 px-8 py-3 rounded-full text-lg font-semibold transition"
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

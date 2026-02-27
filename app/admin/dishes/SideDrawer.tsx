"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode; // optional future actions
}

export default function SideDrawer({
    isOpen,
    onClose,
    title = "Panel",
    children,
    footer,
}: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="
              fixed right-0 top-0 h-full
              w-[520px] sm:w-[560px] lg:w-[600px]
              bg-white
              shadow-2xl
              z-50
              flex flex-col
              border-l
            "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                            <h2 className="text-lg font-semibold">
                                {title}
                            </h2>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-200 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {children}
                        </div>

                        {/* Optional Footer */}
                        {footer && (
                            <div className="border-t px-6 py-4 bg-gray-50">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
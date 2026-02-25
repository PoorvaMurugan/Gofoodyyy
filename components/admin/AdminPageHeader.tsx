"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";

interface Props {
    title: string;
    subtitle?: string;
    buttonText?: string;
    onAddClick?: () => void;
    children?: ReactNode;
}

export default function AdminPageHeader({
    title,
    subtitle,
    buttonText,
    onAddClick,
    children,
}: Props) {
    return (
        <div className="mb-6">

            {/* Top Row */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>

                {buttonText && (
                    <button
                        onClick={onAddClick}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        <Plus size={16} />
                        {buttonText}
                    </button>
                )}
            </div>

            {children}
        </div>
    );
}
"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                {buttonText && (
                    <Button
                        onClick={onAddClick}
                        size="sm"
                        className="gap-2"
                    >
                        <Plus size={16} />
                        {buttonText}
                    </Button>
                )}
            </div>

            {children}
        </div>
    );
}
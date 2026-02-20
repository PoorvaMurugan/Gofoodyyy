"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "./CartContext";

export interface Order {
    id: string;
    date: string;
    time: string;
    status: "delivered" | "preparing" | "cancelled";
    items: CartItem[];
    total: number;
}

interface OrderContextType {
    orders: Order[];
    placeOrder: (items: CartItem[], total: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(
    undefined
);

export function OrderProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [orders, setOrders] = useState<Order[]>([]);

    const placeOrder = (items: CartItem[], total: number) => {
        const now = new Date();

        const newOrder: Order = {
            id: "ORD-" + Math.floor(Math.random() * 100000),
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            status: "preparing",
            items,
            total,
        };

        setOrders((prev) => [newOrder, ...prev]);
    };

    return (
        <OrderContext.Provider value={{ orders, placeOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (!context)
        throw new Error("useOrders must be used inside OrderProvider");
    return context;
}
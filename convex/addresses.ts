import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get addresses
export const getUserAddresses = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("addresses")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
    },
});

// Add address (first one auto default)
export const addAddress = mutation({
    args: {
        userId: v.id("users"),
        label: v.string(),
        street: v.string(),
        city: v.string(),
        state: v.string(),
        pincode: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("addresses")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const isFirst = existing.length === 0;

        await ctx.db.insert("addresses", {
            ...args,
            isDefault: isFirst,
        });
    },
});

// Set default
export const setDefaultAddress = mutation({
    args: {
        userId: v.id("users"),
        addressId: v.id("addresses"),
    },
    handler: async (ctx, args) => {
        const all = await ctx.db
            .query("addresses")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        for (const addr of all) {
            await ctx.db.patch(addr._id, { isDefault: false });
        }

        await ctx.db.patch(args.addressId, { isDefault: true });
    },
});


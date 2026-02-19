import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addToCart = mutation({
    args: {
        userId: v.id("users"),
        menuItemId: v.id("menuItems"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("cartItems")
            .filter((q) =>
                q.and(
                    q.eq(q.field("userId"), args.userId),
                    q.eq(q.field("menuItemId"), args.menuItemId)
                )
            )
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                quantity: existing.quantity + 1,
            });
            return;
        }

        await ctx.db.insert("cartItems", {
            userId: args.userId,
            menuItemId: args.menuItemId,
            quantity: 1,
            createdAt: Date.now(),
        });
    },
});

export const getCart = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("cartItems")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
    },
});

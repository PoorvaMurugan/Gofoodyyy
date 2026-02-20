import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/* ======================
   GET ALL DISHES
====================== */
export const getDishes = query({
    handler: async (ctx) => {
        return await ctx.db.query("dishes").collect();
    },
});

/* ======================
   ADD DISH
====================== */
export const addDish = mutation({
    args: {
        name: v.string(),
        category: v.string(),
        price: v.number(),
        serving: v.string(),
        rating: v.number(),
        image: v.string(),
        description: v.string(),
        nutrition: v.string(),
        type: v.union(v.literal("veg"), v.literal("nonveg")),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("dishes", {
            ...args,
            isAvailable: true,
        });
    },
});
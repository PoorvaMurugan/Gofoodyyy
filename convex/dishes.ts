import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/* ======================
   GET ALL DISHES (Customer)
====================== */
export const getDishes = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("dishes")
            .filter((q) =>
                q.and(
                    q.eq(q.field("isDeleted"), false),
                    q.eq(q.field("isAvailable"), true)
                )
            )
            .collect();
    },
});

/* ======================
   GET ALL DISHES (Admin)
====================== */
export const getAllDishes = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("dishes")
            .filter((q) => q.eq(q.field("isDeleted"), false))
            .collect();
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
            isDeleted: false,
        });
    },
});

/* ======================
   DELETE (Soft Delete)
====================== */
export const deleteDish = mutation({
    args: { id: v.id("dishes") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isDeleted: true });
    },
});

/* ======================
   TOGGLE AVAILABILITY
====================== */
export const toggleAvailability = mutation({
    args: { id: v.id("dishes") },
    handler: async (ctx, args) => {
        const dish = await ctx.db.get(args.id);
        if (!dish) return;

        await ctx.db.patch(args.id, {
            isAvailable: !dish.isAvailable,
        });
    },
});

export const updateDish = mutation({
    args: {
        id: v.id("dishes"),
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
        await ctx.db.patch(args.id, {
            name: args.name,
            category: args.category,
            price: args.price,
            serving: args.serving,
            rating: args.rating,
            image: args.image,
            description: args.description,
            nutrition: args.nutrition,
            type: args.type,
        });
    },
});
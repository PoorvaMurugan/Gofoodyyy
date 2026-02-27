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
        categoryId: v.id("categories"),
        price: v.number(),
        serving: v.string(),
        rating: v.optional(v.number()),
        image: v.string(),
        description: v.string(),
        nutrition: v.string(),
        type: v.union(v.literal("veg"), v.literal("nonveg")),
        stock: v.number(),
        threshold: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("dishes", {
            ...args,
            isAvailable: args.stock > 0,
            isDeleted: false,
        });
    },
});

/* ======================
   SOFT DELETE
====================== */
export const deleteDish = mutation({
    args: { id: v.id("dishes") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isDeleted: true });
    },
});

/* ======================
   UPDATE FULL DISH (Edit Form)
====================== */
export const updateDish = mutation({
    args: {
        id: v.id("dishes"),
        name: v.string(),
        categoryId: v.id("categories"),
        price: v.number(),
        serving: v.string(),
        rating: v.optional(v.number()),
        image: v.string(),
        description: v.string(),
        nutrition: v.string(),
        type: v.union(v.literal("veg"), v.literal("nonveg")),
        stock: v.number(),
        threshold: v.number(),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;

        await ctx.db.patch(id, {
            ...rest,
            isAvailable: rest.stock > 0,
        });
    },
});

/* ======================
   UPDATE STOCK ONLY (Status Change)
====================== */
export const updateDishStock = mutation({
    args: {
        id: v.id("dishes"),
        stock: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            stock: args.stock,
            isAvailable: args.stock > 0,
        });
    },
});
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
   GET ACTIVE DISHES
   (Available Stock > 0)
====================== */
export const getActiveDishes = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("dishes")
            .filter((q) =>
                q.and(
                    q.eq(q.field("isDeleted"), false),
                    q.gt(q.field("stock"), 0)
                )
            )
            .collect();
    },
});

/* ======================
   GET LOW STOCK DISHES
   (Stock <= Threshold AND Stock > 0)
====================== */
export const getLowStockDishes = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("dishes")
            .filter((q) =>
                q.and(
                    q.eq(q.field("isDeleted"), false),
                    q.and(
                        q.lte(q.field("stock"), q.field("threshold")),
                        q.gt(q.field("stock"), 0)
                    )
                )
            )
            .collect();
    },
});

/* ======================
   GET OUT OF STOCK
   (Stock === 0)
====================== */
export const getOutOfStockDishes = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("dishes")
            .filter((q) =>
                q.and(
                    q.eq(q.field("isDeleted"), false),
                    q.eq(q.field("stock"), 0)
                )
            )
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
        rating: v.number(),
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

            // ✅ Availability ONLY depends on stock > 0
            isAvailable: args.stock > 0,

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
   TOGGLE AVAILABILITY (Manual override if needed)
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

/* ======================
   UPDATE DISH
====================== */
export const updateDish = mutation({
    args: {
        id: v.id("dishes"),
        name: v.string(),
        categoryId: v.id("categories"),
        price: v.number(),
        serving: v.string(),
        rating: v.number(),
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

            // ✅ Again availability ONLY depends on stock > 0
            isAvailable: rest.stock > 0,
        });
    },
});
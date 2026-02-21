import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import MenuClient from "./MenuClient";

export default async function MenuPage() {
    const dishes = await fetchQuery(api.dishes.getDishes);

    return <MenuClient dishes={dishes} />;
}
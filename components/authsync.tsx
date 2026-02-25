"use client";

import { useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AuthSync() {
    const user: any = useUser();
    const createUser = useMutation(api.users.createUser);

    const email =
        user?.email ||
        user?.primaryEmail ||
        user?.primaryEmailAddress?.email ||
        user?.emails?.[0]?.email ||
        null;

    useEffect(() => {
        if (!user || !email) return;

        createUser({
            name: user.displayName || "User",
            email,
        });
    }, [user, email, createUser]);

    return null;
}
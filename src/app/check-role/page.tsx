
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckRolePage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        const role = user?.publicMetadata?.role;

        if (!role) {
            router.push("/select-role");
        } else {
            router.push("/dashboard");
        }
    }, [isLoaded, user]);

    return <div>Loading...</div>;
}

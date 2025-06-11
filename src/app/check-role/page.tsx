"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckRolePage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!isLoaded || isRedirecting) return;

        const role = user?.publicMetadata?.role;

        if (!role) {
            setIsRedirecting(true);
            router.push("/select-role");
        } else {
            setIsRedirecting(true);
            if (role === "STUDENT") {
                router.push("/student/dashboard");
            } else if (role === "TEACHER") {
                router.push("/teacher/dashboard");
            }
        }
    }, [isLoaded, user, isRedirecting]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                <p className="mt-4">Redirecting...</p>
            </div>
        </div>
    );
}
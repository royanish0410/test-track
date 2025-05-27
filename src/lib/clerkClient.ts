import { createClerkClient } from "@clerk/nextjs/server"

export const ClerkClient = createClerkClient({
    secretKey:process.env.CLERK_SECRET_KEY,
    publishableKey:process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
})
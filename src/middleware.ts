import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define route matchers
const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/clerk',
    '/api/public(.*)',
    '/about',
    '/contact'
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isAuthRoute = createRouteMatcher(['/sign-in', '/sign-up'])

export default clerkMiddleware(async(auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth()

    if (isPublicRoute(req)) {
        return NextResponse.next()
    }
    if (!userId) {
        return redirectToSignIn({ returnBackUrl: req.url })
    }

    if (isAdminRoute(req)) {
        const userRole = sessionClaims?.metadata?.role
        if (userRole !== 'admin') {
            const url = new URL('/unauthorized', req.url)
            return NextResponse.redirect(url)
        }
    }
    if (isAuthRoute(req)) {
        const url = new URL('/dashboard', req.url)
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
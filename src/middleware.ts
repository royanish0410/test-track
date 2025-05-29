import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/clerk',
    '/api/public(.*)',
    '/about',
    '/contact'
])

const isTeacherRoute = createRouteMatcher([
    "/teacher(.*)",
])

const isStudentRoute = createRouteMatcher([
    "/student(.*)",
])

const isAuthenticatedRoute = createRouteMatcher([
    '/api/users(.*)',
    '/api/student(.*)',
    '/api/teacher(.*)',
    '/api/settings(.*)',
    '/profile(.*)'
])

export default clerkMiddleware(async(auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth()

    if (isPublicRoute(req)) {
        return NextResponse.next()
    }

    if (!userId) {
        return redirectToSignIn({ returnBackUrl: req.url })
    }

    const userRole = sessionClaims?.metadata?.role;

    if(!userRole){
        if(req.nextUrl.pathname !== "/select-role"){
            return NextResponse.redirect(new URL('/check-role',req.url))
        }
        return NextResponse.next();
    }

    if(isTeacherRoute(req) && userRole !== "TEACHER"){

        // TODO: API LEVEL RESTRICTION TO BE LATER

        return NextResponse.redirect(new URL('/teacher/dashboard',req.url))
    }

    if(isStudentRoute(req) && userRole !== "STUDENT"){

        // TODO: API LEVEL RESTRICTION TO BE LATER

        return NextResponse.redirect(new URL('/student/dashboard',req.url))
    }

    if(isAuthenticatedRoute(req)){
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL(`/${userRole === "STUDENT"?"student":"teacher"}/dashboard`,req.url))
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
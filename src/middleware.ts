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
    "/teacher/allquizzes",
    "/teacher/createquizzes",
    "/teacher/dashboard",
    "/teacher/score",
])

const isStudentRoute = createRouteMatcher([
    "/student/attemptquiz",
    "/student/dashboard",
    "/student/quizlists",
    "/student/score",
])

const isAuthenticatedRoute = createRouteMatcher([
    '/api/users(.*)',
    '/api/student(.*)',
    '/api/teacher(.*)',
    '/api/settings(.*)',
    '/profile(.*)',
    '/check-role',
    '/select-role'
])

// export default clerkMiddleware(async(auth,req)=>{
//     const {userId,sessionClaims,} = await auth();
//     console.log(sessionClaims);
//     return NextResponse.next();
// }
// );

export default clerkMiddleware(async(auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth()

    if (isPublicRoute(req)) {
        return NextResponse.next()
    }

    if (!userId) {
        return redirectToSignIn({ returnBackUrl: req.url })
    }

    const userRole = sessionClaims?.metadata?.role;

    if (!userRole) {
        if (req.nextUrl.pathname === "/select-role" || req.nextUrl.pathname === "/check-role") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/check-role', req.url))
    }

    if(isTeacherRoute(req) && userRole !== "TEACHER"){

        // TODO: API LEVEL RESTRICTION TO BE LATER

        return NextResponse.redirect(new URL('/student/dashboard',req.url))
    }

    if(isStudentRoute(req) && userRole !== "STUDENT"){

        // TODO: API LEVEL RESTRICTION TO BE LATER

        return NextResponse.redirect(new URL('/teacher/dashboard',req.url))
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
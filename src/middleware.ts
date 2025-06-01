import { clerkMiddleware } from '@clerk/nextjs/server'
// import { NextResponse } from 'next/server'

// const isPublicRoute = createRouteMatcher([
//     '/',
//     '/sign-in(.*)',
//     '/sign-up(.*)',
//     '/api/webhooks/clerk',
//     '/api/public(.*)',
//     '/about',
//     '/contact',
//     '/api/quiz(.*)'
// ])

// const isTeacherRoute = createRouteMatcher([
//     "/teacher/allquizzes",
//     "/teacher/createquizzes",
//     "/teacher/dashboard",
//     "/teacher/score",
// ])

// const isStudentRoute = createRouteMatcher([
//     "/student/attemptquiz",
//     "/student/dashboard",
//     "/student/quizlists",
//     "/student/score",
// ])

// const isAuthenticatedRoute = createRouteMatcher([
//     '/api/users(.*)',
//     '/api/student(.*)',
//     '/api/teacher(.*)',
//     '/api/settings(.*)',
//     '/profile(.*)',
//     '/check-role',
//     '/select-role'
// ])

// export default clerkMiddleware(async(auth,req)=>{
//     const {userId,sessionClaims,} = await auth();
//     console.log(sessionClaims);
//     return NextResponse.next();
// }
// );

export default clerkMiddleware()

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
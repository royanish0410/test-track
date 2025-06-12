import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/clerk',
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
    '/check-role',
    '/select-role'
])

export default clerkMiddleware(async(auth,req)=>{

    const { userId, sessionClaims } = await auth();

    console.log(`UserId : ${userId?'Exists':'No exists'} : ${userId}`);

    if(isPublicRoute(req) && !userId){
        return NextResponse.next();
    }

    if(userId && isPublicRoute(req)){
        const { metadata } = sessionClaims;
        const userRole = metadata?.role;
        if(userRole){
            console.log(`userId : ${userId} and No need to sign-in or sign-up again. Redirecting..... To ${userRole} dashboard`);
            const dashboardUrl = new URL(`/${userRole.toLowerCase().trim()}/dashboard/`,req.url)
            return NextResponse.redirect(dashboardUrl);
        }
        return NextResponse.next();
    }

    if(!userId && isAuthenticatedRoute(req)){
        console.error(`userId : ${userId} and this route is allowed only when the user is signed in. Redirecting...`);
        const BackToSignInURL = new URL('/sign-in',req.url);
        return NextResponse.redirect(BackToSignInURL);
    }
    if(userId && isAuthenticatedRoute(req)){
        return NextResponse.next()
    }

    if(userId && isStudentRoute(req)){
        const { metadata } = sessionClaims;
        const userRole = metadata?.role;
        if(userRole==="TEACHER"){
            console.error(`userId : ${userId}, has a role of teacher, yet accessing student routes.`);
            console.log("REDIRECTING..... To teacher dashboard");
            const redirectToTeacherDashboard = new URL(`/${userRole.toLowerCase().trim()}/dashboard`,req.url)
            return NextResponse.redirect(redirectToTeacherDashboard);
        }
        return NextResponse.next()
    }

    if(userId && isTeacherRoute(req)){
        const { metadata } = sessionClaims;
        const userRole = metadata?.role;
        if(userRole==="STUDENT"){
            console.error(`userId : ${userId}, has a role of student, yet accessing teacher routes.`);
            console.log("REDIRECTING..... To student dashboard");
            const redirectToTeacherDashboard = new URL(`/${userRole.toLowerCase().trim()}/dashboard`,req.url)
            return NextResponse.redirect(redirectToTeacherDashboard);
        }
        return NextResponse.next()
    }

    return NextResponse.next();
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
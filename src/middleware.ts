import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/uploadthing(.*)", "/"]);

export default clerkMiddleware(
  async (auth, req) => {
    const url = req.nextUrl;
    if (isProtectedRoute(req)) {
      if (url.pathname === "/") {
        return NextResponse.redirect(new URL("/uploadthing", req.url));
      }
      await auth.protect();
    }

    return NextResponse.next();
  },
  { afterSignUpUrl: "/uploadthing", afterSignInUrl: "/uploadthing" }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

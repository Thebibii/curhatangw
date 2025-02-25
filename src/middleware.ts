import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/notification(.*)"]);
const isTag = createRouteMatcher(["/tag(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isTag(req)) {
    if (!searchParams.has("s")) {
      const allValues = Array.from(searchParams.values());
      const firstValue = allValues[0] || "";
      const newUrl = new URL("/tag", req.url);
      newUrl.searchParams.set("s", firstValue);

      return NextResponse.redirect(newUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

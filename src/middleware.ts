import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // let paramPostId = request.nextUrl.pathname.includes("postId");
  // console.log(paramPostId);
  // let paramUserId = request.nextUrl.pathname.includes("userId");
  // if (paramPostId) {
  //   // const [slug] = request.nextUrl.pathname.split("-");
  //   return NextResponse.rewrite(
  //     new URL(`/api/post/${paramPostId}`, request.url)
  //   );
  // }
  // if (paramUserId) {
  //   // const [slug] = request.nextUrl.pathname.split("-");
  //   return NextResponse.rewrite(
  //     new URL(`/api/user/${paramUserId}`, request.url)
  //   );
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

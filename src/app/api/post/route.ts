import { getPosts } from "@/actions/post.action";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}
/* import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId: user_id } = await auth();
  if (!user_id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const posts = await prisma.post.findMany({
    where: {
      clerkId,
    },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  try {
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { content, image } = await request.json();
    if (!image) {
      return new NextResponse("Image URL is required.", { status: 400 });
    }
    const post = await prisma.post.create({
      data: { content, image, clerkId },
    });
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}
 */

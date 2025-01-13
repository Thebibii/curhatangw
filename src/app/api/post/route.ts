import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId: user_id } = await auth();
  if (!user_id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const posts = await prisma.post.findMany({
    where: {
      user_id,
    },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const { userId: user_id } = await auth();
  try {
    if (!user_id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { title, content } = await request.json();
    const post = await prisma.post.create({
      data: { title, content, user_id },
    });
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

/* export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
} */

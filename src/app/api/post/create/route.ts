import { createPost } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content, image } = await request.json();
    const post = await createPost(content, image);
    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

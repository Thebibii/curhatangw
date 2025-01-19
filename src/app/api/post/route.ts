import { getPosts } from "@/actions/post.action";

import { createPost } from "@/actions/post.action";
import { NextRequest, NextResponse } from "next/server";
export async function GET() {
  try {
    const posts = await getPosts();

    return NextResponse.json({
      success: true,
      message: "All posts successfully",
      data: posts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

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

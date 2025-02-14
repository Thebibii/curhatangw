import { getPosts } from "@/actions/post.action";

import { createPost } from "@/actions/post.action";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limitParam = searchParams.get("limit");

    const limit = Number(limitParam) || 10;
    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid limit parameter" },
        { status: 400 }
      );
    }

    const { posts, nextCursor } = await getPosts(limit, cursor);

    return NextResponse.json({
      success: true,
      message: "All posts retrieved successfully",
      data: posts,
      nextCursor,
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
    const { content, image, tags } = await request.json();
    const post = await createPost(content, image, tags);
    return NextResponse.json(
      {
        success: true,
        message: "Post created successfully",
        data: post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

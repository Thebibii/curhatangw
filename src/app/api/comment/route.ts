import { createComment } from "@/actions/comment.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { postId, content } = await request.json();
    if (!postId || !content) {
      return NextResponse.json(
        { success: false, message: "Post ID and content are required" },
        { status: 400 }
      );
    }

    const { success, data, message } = await createComment(postId, content);

    if (!success) {
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment created successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

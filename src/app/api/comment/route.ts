import { createComment } from "@/actions/comment.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { postId, content } = await request.json();
    const comment = await createComment(postId, content);
    return NextResponse.json(
      {
        success: true,
        message: "Comment created successfully",
        data: comment,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to create comment",
    });
  }
}

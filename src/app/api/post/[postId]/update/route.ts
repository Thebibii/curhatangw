import { updatePost } from "@/actions/post.action";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  try {
    const { content, image, tags } = await request.json();
    const post = await updatePost(postId, content, image);
    return NextResponse.json(
      {
        success: true,
        message: "Post updated successfully",
        data: post,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

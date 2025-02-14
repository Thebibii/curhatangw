import { deletePost } from "@/actions/post.action";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { postId } = await params;

    const { postId: id } = await deletePost(postId);
    return NextResponse.json({
      success: true,
      message: "Your post has been deleted successfully",
      data: { id },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

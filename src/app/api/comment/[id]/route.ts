import { deleteComment } from "@/actions/comment.action";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;

    await deleteComment(id);

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

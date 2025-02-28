import { deleteComment, updateComment } from "@/actions/comment.action";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const { content } = await request.json();

    const updatedComment = await updateComment(id, content);
    return NextResponse.json({
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { commentId } = await deleteComment(id);
    return NextResponse.json({
      success: true,
      message: "Your comment has been deleted successfully",
      data: { id: commentId },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

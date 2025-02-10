import { getComments } from "@/actions/comment.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { postId } = await params;
    const comments = await getComments(postId);
    if (comments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No comments in this post",
        data: [],
      });
    }
    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

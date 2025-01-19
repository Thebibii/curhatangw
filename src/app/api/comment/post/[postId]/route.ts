import { getComments } from "@/actions/comment.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { postId } = await params;
    const comments = await getComments(postId);
    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

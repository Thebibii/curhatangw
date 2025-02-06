import { getDetailPost } from "@/actions/post.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { postId } = await params;
    const post = await getDetailPost(postId);
    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

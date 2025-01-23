import { getUserPosts } from "@/actions/post.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { userId } = await params;
    const posts = await getUserPosts(userId);
    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

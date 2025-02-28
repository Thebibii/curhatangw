import { getUserLikedPosts } from "@/actions/profile.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  try {
    const posts = await getUserLikedPosts(username);
    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

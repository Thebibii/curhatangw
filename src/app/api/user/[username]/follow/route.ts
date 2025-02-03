import { isFollowing } from "@/actions/user.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  const { username } = await params;
  try {
    const isFollowingUser = await isFollowing(username);
    return NextResponse.json({
      success: true,
      message: isFollowingUser ? "You are following" : "You are not following",
      data: isFollowingUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

import { toggleFollow } from "@/actions/user.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    await toggleFollow(userId);
    return NextResponse.json({ success: true, message: "User followed" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

import { getProfileByUsername } from "@/actions/profile.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const profile = await getProfileByUsername(username);
    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 404 }
    );
  }
}

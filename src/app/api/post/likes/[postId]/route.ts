import { toggleLike } from "@/actions/post.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    await toggleLike(postId);
    return NextResponse.json({
      success: true,
      message: "Your post has been liked successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

import { getUserByClerkId, updateCurrentUser } from "@/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log(userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await getUserByClerkId(userId);

    return NextResponse.json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    await updateCurrentUser(data);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 404 }
    );
  }
}

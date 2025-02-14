import { getUserByClerkId, updateCurrentUser } from "@/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let user = await getUserByClerkId(userId);

    if (!user) {
      console.log("User not found, starting retry...");

      let retries = 5;
      const delay = 500;

      while (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        user = await getUserByClerkId(userId);
        if (user) {
          break;
        }
        retries--;
      }
    }

    if (!user) {
      return new NextResponse("User data not available after retries", {
        status: 404,
      });
    }

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

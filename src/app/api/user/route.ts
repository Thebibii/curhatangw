import { getUserByClerkId, updateCurrentUser } from "@/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log(userId, "cek user api");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let user = null;
    let retries = 5;
    let delay = 100; // Delay 1 detik antara percobaan

    // Retry logic untuk menunggu sampai data user tersedia
    while (retries > 0) {
      user = await getUserByClerkId(userId);
      if (user) {
        break; // Jika data ditemukan, keluar dari loop
      }
      console.log("Retrying to fetch user data...");
      await new Promise((resolve) => setTimeout(resolve, delay)); // Tunggu 1 detik
      retries--;
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

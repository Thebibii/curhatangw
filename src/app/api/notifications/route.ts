import { getNotifications } from "@/actions/notification.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const notifications = await getNotifications();
    return NextResponse.json({
      success: true,
      message: "All notifications retrieved successfully",
      data: notifications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

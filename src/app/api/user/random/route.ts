import { getRandomUsers } from "@/actions/user.action";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const users = await getRandomUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

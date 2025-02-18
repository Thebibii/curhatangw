import { createTag, getTags } from "@/actions/tag.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tag_ids =
      searchParams
        .get("tag_ids")
        ?.split(",")
        .filter((id) => id.trim() !== "") || [];

    const tag_names = searchParams.get("tag_names") || "";

    const tag = await getTags(tag_ids, tag_names);
    return NextResponse.json({ success: true, data: tag });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const tag = await createTag(name);
  return NextResponse.json({ success: true, data: tag });
}

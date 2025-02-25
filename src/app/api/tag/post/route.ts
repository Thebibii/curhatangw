import { getPostByTag } from "@/actions/tag.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag_ids =
    searchParams
      .get("s")
      ?.split(" ")
      .filter((id) => id.trim() !== "") || [];

  const posts = await getPostByTag(tag_ids);
  return NextResponse.json({ success: true, data: posts });
}

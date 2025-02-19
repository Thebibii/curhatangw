import { getTagsByTrending } from "@/actions/tag.action";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const tags = await getTagsByTrending();
  return NextResponse.json({
    success: true,
    data: tags,
    message: "Trending tags",
  });
}

import { createTag, getTags } from "@/actions/tag.action";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const tag = await getTags();
  return NextResponse.json({ success: true, data: tag });
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const tag = await createTag(name);
  return NextResponse.json({ success: true, data: tag });
}

import prisma from "@/lib/db/prisma";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk Webhook: create or delete a user in the database by Clerk ID
let webhookResponse: any = null;

export async function POST(req: Request) {
  try {
    // Parse the Clerk Webhook event
    const evt = (await req.json()) as WebhookEvent;

    const { id: clerkId } = evt.data;

    if (!clerkId)
      return NextResponse.json(
        { error: "No user ID provided" },
        { status: 400 }
      );

    // Create or delete a user in the database based on the Clerk Webhook event
    let user = null;
    switch (evt.type) {
      case "user.created": {
        const {
          email_addresses = [],
          username,
          image_url,
          first_name,
          last_name,
        } = evt.data;
        const email = email_addresses?.[0]?.email_address;

        const usernameByEmail = email?.split("@")[0];
        const name = `${first_name} ${last_name}`;

        user = await prisma.user.upsert({
          where: {
            clerkId,
          },
          update: {
            clerkId,
            email: email ?? "",
            username: username ?? usernameByEmail,
            image: image_url,
            name: name ?? usernameByEmail,
          },
          create: {
            clerkId,
            email: email ?? "",
            username: username ?? usernameByEmail,
            image: image_url,
            name: name ?? usernameByEmail,
          },
        });

        break;
      }
      case "user.updated": {
        const {
          email_addresses = [],
          username,
          image_url,
          first_name,
          last_name,
        } = evt.data;
        const email = email_addresses?.[0]?.email_address;
        const usernameByEmail = email?.split("@")[0];

        user = await prisma.user.update({
          where: {
            clerkId,
          },
          data: {
            email,
            username: username ?? usernameByEmail,
            image: image_url,
            name: `${first_name || ""} ${last_name || ""}`,
          },
        });
        break;
      }
      case "user.deleted": {
        user = await prisma.user.delete({
          where: {
            clerkId,
          },
        });
        break;
      }
      default:
        break;
    }

    if (user) {
      webhookResponse = user;
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
    // return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    return NextResponse.json(webhookResponse);
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
    // return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

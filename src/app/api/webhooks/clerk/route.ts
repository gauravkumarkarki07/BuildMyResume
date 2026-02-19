import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    await db.user.upsert({
      where: { clerkId: id },
      update: {
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
      create: {
        clerkId: id,
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      await db.user.delete({ where: { clerkId: id } }).catch(() => {
        // User may already be deleted
      });
    }
  }

  return NextResponse.json({ received: true });
}

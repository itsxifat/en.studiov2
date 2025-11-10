export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createClient } from "ioredis";

export async function GET() {
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
      tls: {}, // keep TLS explicit
    });
    await client.connect();
    const pong = await client.ping();
    await client.quit();
    return NextResponse.json({ success: true, pong });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

// app/api/live/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Server } from "socket.io";

// --- Global singleton ---
let io = globalThis._io;

export async function GET() {
  try {
    // Initialize only once
    if (!io) {
      console.log("🔌 Starting Socket.IO server (no Redis)...");

      io = new Server({
        cors: { origin: "*", methods: ["GET", "POST"] },
        transports: ["websocket"],
        path: "/api/live/socket",
      });

      globalThis._io = io;
      console.log("✅ Socket.IO initialized (single-instance mode).");

      // In-memory live visitor map
      const activeUsers = new Map();

      io.on("connection", (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        socket.on("join", (userData) => {
          if (!userData?.ip) return;
          activeUsers.set(socket.id, userData);
          io.emit("visitors", Array.from(activeUsers.values()));
        });

        socket.on("disconnect", () => {
          activeUsers.delete(socket.id);
          io.emit("visitors", Array.from(activeUsers.values()));
          console.log(`[Socket] Disconnected: ${socket.id}`);
        });
      });
    }

    return NextResponse.json({
      success: true,
      message: "Socket.IO live server running (no Redis).",
    });
  } catch (err) {
    console.error("❌ Live Socket.IO Error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

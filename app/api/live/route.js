// app/api/live/route.js
import { NextResponse } from "next/server";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "ioredis";

let io; // Singleton socket server

export async function GET(request) {
  if (!io) {
    const httpServer = request.socket?.server || request.raw?.server;

    if (!httpServer.io) {
      const ioInstance = new Server(httpServer, {
        path: "/api/live/socket",
        cors: { origin: "*" },
        transports: ["websocket"],
      });

      // ✅ --- Redis Adapter (Add this block here) ---
      try {
        const pubClient = createClient({ url: process.env.REDIS_URL });
        const subClient = pubClient.duplicate();

        await pubClient.connect();
        await subClient.connect();

        ioInstance.adapter(createAdapter(pubClient, subClient));
        console.log("✅ Redis adapter connected for Socket.IO clustering.");
      } catch (err) {
        console.error("❌ Redis connection failed:", err);
      }
      // ✅ --- End of Redis adapter setup ---

      httpServer.io = ioInstance;
      io = ioInstance;

      console.log("✅ Socket.IO live server started.");

      // In-memory active users
      const activeUsers = new Map();

      io.on("connection", (socket) => {
        socket.on("join", (userData) => {
          if (!userData?.ip) return;
          activeUsers.set(socket.id, userData);
          io.emit("visitors", Array.from(activeUsers.values()));
        });

        socket.on("disconnect", () => {
          activeUsers.delete(socket.id);
          io.emit("visitors", Array.from(activeUsers.values()));
        });
      });
    }
  }

  return NextResponse.json({ success: true });
}

"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

// Fix for broken marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function LiveVisitorMap() {
  const [visitors, setVisitors] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Ensure server-side socket is initialized
    fetch("/api/live");

    const socket = io({
      path: "/api/live/socket",
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // Fetch client IP + geo data
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.warn("Geo API failed:", data.message);
          return;
        }

        // Ensure valid coords
        if (data.latitude && data.longitude) {
          const userData = {
            ip: data.ip,
            location: data.city
              ? `${data.city}, ${data.country}`
              : data.country,
            coordinates: [data.longitude, data.latitude], // [lng, lat]
          };
          socket.emit("join", userData);
        }
      })
      .catch((err) => console.error("Geo fetch error:", err));

    // Receive visitor updates
    socket.on("visitors", (list) => {
      console.log("🔵 Live visitors:", list);
      setVisitors(list);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Convert visitor data into Leaflet markers (flip coords → [lat, lng])
  const markers = visitors
    .filter((v) => Array.isArray(v.coordinates) && v.coordinates.length === 2)
    .map((v, i) => ({
      id: i,
      position: [v.coordinates[1], v.coordinates[0]], // ✅ flip [lng, lat] → [lat, lng]
      name: v.location || v.ip,
    }));

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-2 sm:p-4 rounded-xl h-[300px] md:h-[500px]">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#334155",
          borderRadius: "8px",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Tooltip>{marker.name}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

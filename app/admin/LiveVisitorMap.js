"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

// Fix for marker icons in Next.js
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
    const socket = io({
      path: "/api/live/socket",
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // Get client IP + geo data
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;
        const userData = {
          ip: data.ip,
          location: data.city ? `${data.city}, ${data.country}` : data.country,
          coordinates: [data.latitude, data.longitude],
        };
        socket.emit("join", userData);
      });

    // Receive visitor updates
    socket.on("visitors", (list) => {
      setVisitors(list);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Convert visitor data into Leaflet markers
  const markers = visitors
    .filter((v) => v.coordinates?.length === 2)
    .map((v, i) => ({
      id: i,
      position: [v.coordinates[0], v.coordinates[1]],
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

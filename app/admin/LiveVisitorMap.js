"use client";

import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Loader2 } from 'lucide-react'; // Import loader for consistency

// --- FIX for broken Leaflet icons in Next.js ---
// This prevents the default icons from showing as broken images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
// --- End of icon fix ---

/**
 * Renders a live visitor map using React-Leaflet.
 * Assumes 'visits' is an array of objects, where each object has:
 * - _id: string
 * - coordinates: [number, number] (e.g., [longitude, latitude])
 * - location: string (e.g., "City, Country")
 * - ip: string
 */
export default function LiveVisitorMap({ visits = [] }) {
  
  // Filter visits that have valid coordinate data from the backend
  const markers = visits
    .filter(v => v.coordinates && v.coordinates.length === 2)
    .map(v => ({
      _id: v._id,
      name: v.location || v.ip, // Show location if available, fallback to IP
      // CRITICAL: Leaflet uses [lat, lng], but we stored [lng, lat]
      // We must flip them here!
      position: [v.coordinates[1], v.coordinates[0]], 
    }));

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-2 sm:p-4 rounded-xl h-[300px] md:h-[500px]">
      <MapContainer
        center={[20, 0]} // Start centered on the world
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', backgroundColor: '#334155', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(marker => (
          <Marker key={marker._id} position={marker.position}>
            <Tooltip>{marker.name}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
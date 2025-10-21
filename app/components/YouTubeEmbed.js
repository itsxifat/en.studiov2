// app/components/YouTubeEmbed.jsx
"use client";

import React from 'react';

// You will need this component to display the YouTube videos fetched from the database
const YouTubeEmbed = ({ youtubeId, title, autoPlay = false }) => {
  if (!youtubeId) return null;

  // Parameters: autoplay, modest branding, related videos off, info/annotations off, minimal controls
  const src = `https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&controls=1`;

  return (
    <div className="relative aspect-video w-full h-full">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={src}
        title={title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;

import { NextResponse } from 'next/server';
const { google } = require('googleapis');

export async function GET() {
  try {
    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN,
      GOOGLE_ALBUM_ID,
      GOOGLE_SHARE_TOKEN, // Optional: for shared albums
    } = process.env;

    // --- 1. Check Environment Variables ---
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_ALBUM_ID) {
      console.error("ERROR: Missing one or more Google credentials in .env.local");
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // --- 2. Initialize OAuth2 Client ---
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    // --- 3. Set Credentials ---
    oauth2Client.setCredentials({
      refresh_token: GOOGLE_REFRESH_TOKEN,
    });

    // --- 4. Get a Fresh Access Token ---
    const { token: accessToken } = await oauth2Client.getAccessToken();
    if (!accessToken) {
      throw new Error("Failed to generate Access Token.");
    }

    // --- 5. Prepare Request Body ---
    // If it's a shared album, we need to use shareToken instead of albumId
    const requestBody = GOOGLE_SHARE_TOKEN
      ? {
          pageSize: 100,
          pageToken: '', // For pagination
          filters: {
            includeArchivedMedia: false,
          },
        }
      : {
          albumId: GOOGLE_ALBUM_ID,
          pageSize: 100,
        };

    // --- 6. Make API Call ---
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // Add share token to headers if provided
    if (GOOGLE_SHARE_TOKEN) {
      headers['X-Goog-Sharing-Token'] = GOOGLE_SHARE_TOKEN;
    }

    const response = await fetch(
      `https://photoslibrary.googleapis.com/v1/mediaItems:search`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Photos API Error:', errorData);
      
      // Special handling for shared album errors
      if (errorData.error?.code === 404 || errorData.error?.message?.includes('not found')) {
        console.error('❌ Album not found. For shared albums, try adding it to your library first.');
      }
      
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // --- 7. Check if Album Has Photos ---
    if (!data.mediaItems || data.mediaItems.length === 0) {
      console.warn("No media items found in this album.");
      return NextResponse.json({ success: true, photos: [] });
    }

    // --- 8. Process Data ---
    const processedPhotos = data.mediaItems
      .filter(item => item.mimeType && item.mimeType.startsWith('image/'))
      .map(item => ({
        id: item.id,
        thumbnailUrl: `${item.baseUrl}=w600`,
        highResUrl: `${item.baseUrl}=w2048-h1024`,
        width: item.mediaMetadata?.width || 0,
        height: item.mediaMetadata?.height || 0,
        filename: item.filename || 'Unknown',
      }));

    // --- 9. Send Response ---
    return NextResponse.json({ 
      success: true, 
      photos: processedPhotos,
      hasMore: !!data.nextPageToken 
    });

  } catch (error) {
    // --- 10. ERROR HANDLING ---
    console.error("\n--- CRITICAL ERROR CAUGHT ---");
    
    if (error.message.includes("403") || error.message.includes("PERMISSION_DENIED")) {
      console.error("❌ PERMISSION DENIED (403): Your refresh token doesn't have the correct scopes!");
      console.error("📝 SOLUTION: Generate a new refresh token at https://developers.google.com/oauthplayground");
      console.error("🔑 Required scope: https://www.googleapis.com/auth/photoslibrary.readonly");
      return NextResponse.json({ 
        error: 'Insufficient permissions. Your refresh token needs the Google Photos Library scope.',
        solution: 'Regenerate your token at https://developers.google.com/oauthplayground with photoslibrary.readonly scope'
      }, { status: 403 });
    } else if (error.message.includes("401") || error.message.includes("invalid_grant")) {
      console.error("❌ AUTHENTICATION FAILED (401): Your REFRESH TOKEN is invalid or expired.");
      return NextResponse.json({ 
        error: 'Authentication failed. Please refresh your token.' 
      }, { status: 401 });
    } else if (error.message.includes("404") || error.message.includes("Not Found")) {
      console.error("❌ NOT FOUND (404): Album not accessible.");
      console.error("💡 If this is a shared album, add it to your library first!");
      return NextResponse.json({ 
        error: 'Album not found or not accessible.',
        hint: 'For shared albums, click "Add to library" in Google Photos first.'
      }, { status: 404 });
    }
    
    console.error("Full Error:", error.message);
    console.error("Stack:", error.stack);
    
    return NextResponse.json({ 
      error: 'Failed to fetch photos. Check server logs.',
      details: error.message 
    }, { status: 500 });
  }
}
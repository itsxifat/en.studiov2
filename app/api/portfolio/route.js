import dbConnect from '../../lib/dbConnect';
import PortfolioItem from '../../models/portfolioItem';
import { NextResponse } from 'next/server';

// Helper function to extract YouTube ID
function extractYoutubeId(url) {
  if (!url) return null;
  
  // Regex to match YouTube video IDs from various URLs
  const regex = /(?:\/|v=)([\w-]{11})(?:&|\?|#|$)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * @route GET /api/portfolio
 * @description Get all portfolio items, sorted by newest first
 */
export async function GET() {
  await dbConnect();
  try {
    const items = await PortfolioItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * @route POST /api/portfolio
 * @description Add a new portfolio item
 */
export async function POST(request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    // 1. Extract YouTube ID from the link provided by the user
    const youtubeId = extractYoutubeId(body.youtubeLink);
    if (!youtubeId) {
      return NextResponse.json({ success: false, error: 'Invalid or missing YouTube link/ID.' }, { status: 400 });
    }
    
    // 2. Create the data object for Mongoose
    const itemData = {
      title: body.title,
      category: body.category,
      youtubeId: youtubeId,
      thumbnail: body.thumbnail || '', // Optional custom thumbnail
    };

    // 3. Save to database
    const item = await PortfolioItem.create(itemData);
    
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 });
    }
    
    return NextResponse.json({ success: false, error: 'Failed to create item.' }, { status: 500 });
  }
}

import dbConnect from '../../lib/dbConnect';
import PortfolioItem from '../../models/portfolioItem';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/portfolio
 * @description Get all portfolio items
 */
export async function GET() {
  await dbConnect();

  try {
    const items = await PortfolioItem.find({})
      .sort({ createdAt: -1 })
      .select('title category description youtubeId thumbnail createdAt _id')
      .lean();

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('API_PORTFOLIO_GET_ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio items.' },
      { status: 500 }
    );
  }
}

// Writes live under the middleware-protected /api/admin/portfolio routes.

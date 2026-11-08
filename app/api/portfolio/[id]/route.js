import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import PortfolioItem from '../../../models/portfolioItem';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route GET /api/portfolio/[id]
 * @description Get a single portfolio item by its ID
 */
export async function GET(request, { params }) {
  await dbConnect();

  const { id } = await params; // ✅ FIX

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid ID format.' },
      { status: 400 }
    );
  }

  try {
    const item = await PortfolioItem.findById(id).lean();

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(`API_ADMIN_PORTFOLIO_GET_${id}_ERROR:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch item.' },
      { status: 500 }
    );
  }
}

// PUT/DELETE live under the middleware-protected /api/admin/portfolio/[id] route.

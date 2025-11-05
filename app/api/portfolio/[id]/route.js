import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import PortfolioItem from '../../../models/portfolioItem';
import { extractYoutubeId } from '../../../lib/youtubeHelper';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route GET /api/admin/portfolio/[id]
 * @description Get a single portfolio item by its ID
 */
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }

  try {
    const item = await PortfolioItem.findById(id).lean();
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(`API_ADMIN_PORTFOLIO_GET_${id}_ERROR:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch item.' }, { status: 500 });
  }
}

/**
 * @route PUT /api/admin/portfolio/[id]
 * @description Update a portfolio item by its ID
 */
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const title = body.title?.trim();
    const category = body.category?.trim();
    const description = body.description?.trim() || '';
    const youtubeLink = body.youtubeLink?.trim();
    const customThumbnail = body.thumbnail?.trim();
    // liveUrl and githubUrl are removed

    if (!title || !category) {
      return NextResponse.json({ success: false, error: 'Title and Category are required.' }, { status: 400 });
    }

    let youtubeId = null;
    if (youtubeLink) {
      youtubeId = extractYoutubeId(youtubeLink);
      if (youtubeLink && !youtubeId) {
           return NextResponse.json({ success: false, error: 'Invalid YouTube link provided.' }, { status: 400 });
      }
    }

    let thumbnail = customThumbnail || null;
    if (!thumbnail && youtubeId) {
      thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    } else if (!thumbnail && !youtubeId) {
      // If user removes youtube link and doesn't add a custom thumbnail, clear the thumbnail
      thumbnail = null;
    }

    // Update data object without liveUrl and githubUrl
    const updateData = {
      title,
      category,
      description,
      youtubeId,
      thumbnail,
    };

    const updatedItem = await PortfolioItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return NextResponse.json({ success: false, error: 'Item not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
     console.error(`API_ADMIN_PORTFOLIO_PUT_${id}_ERROR:`, error);
    return NextResponse.json({ success: false, error: 'Failed to update item.' }, { status: 500 });
  }
}

/**
 * @route DELETE /api/admin/portfolio/[id]
 * @description Delete a portfolio item by its ID
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }
  
  try {
    const deletedItem = await PortfolioItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ success: false, error: 'Item not found.' }, { status: 404 });
    }
    
    // This item has no relations to other collections,
    // so we can just delete it.
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error(`API_ADMIN_PORTFOLIO_DELETE_${id}_ERROR:`, error);
    return NextResponse.json({ success: false, error: 'Failed to delete item.' }, { status: 500 });
  }
}
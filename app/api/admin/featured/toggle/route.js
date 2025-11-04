import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import PortfolioItem from '../../../../models/portfolioItem';
import PhotoProject from '../../../../models/photoProject'; // ✨ 1. Import the PhotoProject model
import mongoose from 'mongoose';

// Cloudinary is no longer needed in this file
// const { v2 as cloudinary } = require('cloudinary');

export async function POST(request) {
  await dbConnect();
  try {
    const { id, type, currentFeaturedStatus } = await request.json();

    if (!id || !type || typeof currentFeaturedStatus !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Missing required parameters.' }, { status: 400 });
    }

    const newFeaturedStatus = !currentFeaturedStatus;
    let updatedItem;

    if (type === 'video') {
      // --- Handle Video Project ---
      updatedItem = await PortfolioItem.findByIdAndUpdate(
        id,
        { isFeatured: newFeaturedStatus },
        { new: true, runValidators: true } // Return the updated document
      ).lean();

      if (!updatedItem) {
        return NextResponse.json({ success: false, error: 'Video not found.' }, { status: 404 });
      }
      // Return data in a consistent format
      return NextResponse.json({ success: true, data: { ...updatedItem, type: 'video' } });

    // ✨ --- 2. THIS IS THE FIX --- ✨
    // Check for 'photoProject' instead of 'photo'
    } else if (type === 'photoProject') {
      // --- Handle Photo Project ---
      // Find the PhotoProject in the database and update it
      updatedItem = await PhotoProject.findByIdAndUpdate(
        id,
        { isFeatured: newFeaturedStatus },
        { new: true, runValidators: true } // Return the updated document
      ).lean();
      
      if (!updatedItem) {
        return NextResponse.json({ success: false, error: 'Photo Project not found.' }, { status: 404 });
      }
      // Return data in a consistent format
      return NextResponse.json({ success: true, data: { ...updatedItem, type: 'photoProject' } });

    } else {
      // This is what was being triggered
      console.error("Invalid item type received:", type);
      return NextResponse.json({ success: false, error: 'Invalid item type.' }, { status: 400 });
    }

  } catch (error) {
    console.error('API_ADMIN_FEATURED_TOGGLE_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to update featured status.' }, { status: 500 });
  }
}
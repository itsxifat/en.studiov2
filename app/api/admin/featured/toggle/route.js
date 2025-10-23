import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect'; // Ensure path is correct
import PortfolioItem from '../../../../models/portfolioItem'; // Ensure path is correct
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

// ✨ ADD THIS CONFIGURATION BLOCK ✨
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Optional but recommended
});
// ✨ END OF CONFIGURATION BLOCK ✨

export async function POST(request) {
  await dbConnect();
  let requestBody = {};
  try {
    requestBody = await request.json();
    console.log("Received toggle request body:", JSON.stringify(requestBody, null, 2)); // Keep for debugging if needed

    const { id, type, currentFeaturedStatus } = requestBody;

    if (!id || !type || typeof currentFeaturedStatus !== 'boolean') {
      console.error("Validation Failed - Missing required parameters:", { /* ... */ });
      return NextResponse.json({ success: false, error: 'Missing required parameters.' }, { status: 400 });
    }

    const newFeaturedStatus = !currentFeaturedStatus;

    if (type === 'video') {
      // --- Video Update Logic ---
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid video ID format:", id);
        return NextResponse.json({ success: false, error: 'Invalid video ID format.' }, { status: 400 });
      }
      const updatedVideo = await PortfolioItem.findByIdAndUpdate(
        id, { isFeatured: newFeaturedStatus }, { new: true }
      );
      if (!updatedVideo) {
        console.error("Video not found with ID:", id);
        return NextResponse.json({ success: false, error: 'Video not found.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updatedVideo });

    } else if (type === 'photo') {
      // --- Cloudinary Update Logic ---
      // This part failed because config was missing
      const resource = await cloudinary.api.resource(id, { context: true });
      const currentContext = resource.context || {};
      const updatedContext = { ...currentContext, isFeatured: String(newFeaturedStatus) };
      const contextString = Object.entries(updatedContext).map(([k, v]) => `${k}=${v}`).join('|');
      const updateResult = await cloudinary.uploader.add_context(contextString, [id]);

      if (updateResult?.public_ids?.length > 0) {
        const updatedResource = await cloudinary.api.resource(id, { context: true });
        const updatedPhotoData = {
          _id: updatedResource.public_id,
          title: updatedResource.context?.title || updatedResource.filename,
          thumbnail: cloudinary.url(updatedResource.public_id, { width: 300, height: 200, crop: 'fill'}),
          isFeatured: updatedResource.context?.isFeatured === 'true',
          createdAt: updatedResource.created_at,
          type: 'photo'
        };
        return NextResponse.json({ success: true, data: updatedPhotoData });
      } else {
        console.error("Cloudinary context update failed for ID:", id, "Result:", updateResult);
        throw new Error('Cloudinary context update failed.');
      }
    } else {
      console.error("Invalid item type received:", type);
      return NextResponse.json({ success: false, error: 'Invalid item type.' }, { status: 400 });
    }

  } catch (error) {
    console.error('API_ADMIN_FEATURED_TOGGLE_ERROR:', error);
    console.error("Error occurred with request body:", JSON.stringify(requestBody, null, 2)); // Keep for debugging
    // Add specific check for config error
    if (error.message.includes('Must supply cloud_name')) {
        console.error('>>> Cloudinary credentials might be missing in .env.local or not loaded correctly in this route.');
    }
    return NextResponse.json({ success: false, error: 'Failed to update featured status.' }, { status: 500 });
  }
}
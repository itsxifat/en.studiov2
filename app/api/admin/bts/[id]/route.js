import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import BtsItem from '../../../../models/btsItem';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

cloudinary.config({ /* ... credentials ... */ });

// DELETE a single BTS item
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
     return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }

  try {
    const btsItem = await BtsItem.findById(id);
    if (!btsItem) {
      return NextResponse.json({ success: false, error: 'BTS item not found.' }, { status: 404 });
    }

    // If it's an image, delete it from Cloudinary
    if (btsItem.type === 'image' && btsItem.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(btsItem.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.warn("Failed to delete Cloudinary image, proceeding with DB deletion:", cloudinaryError);
      }
    }

    // Delete from MongoDB
    await BtsItem.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('API_ADMIN_BTS_DELETE_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete BTS item.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect'; // Adjust path
import Photo from '../../../../models/photo'; // Adjust path
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

// Configure Cloudinary (must be done in each file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// PUT: Update a photo's text details
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid Photo ID.' }, { status: 400 });
  }

  try {
    const { title, description } = await request.json();
    const photo = await Photo.findById(id);

    if (!photo) {
      return NextResponse.json({ success: false, error: 'Photo not found.' }, { status: 404 });
    }

    // Update MongoDB
    photo.title = title || '';
    photo.description = description || '';
    await photo.save();

    // Update Cloudinary context (optional but good practice)
    const context = `title=${title || ''}|description=${description || ''}`;
    await cloudinary.uploader.add_context(context, [photo.publicId]);

    return NextResponse.json({ success: true, data: photo });
  } catch (error) {
    console.error('API_ADMIN_PHOTO_UPDATE_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to update photo.' }, { status: 500 });
  }
}

// DELETE: Delete a photo
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid Photo ID.' }, { status: 400 });
  }

  try {
    const photo = await Photo.findById(id);
    if (!photo) {
      return NextResponse.json({ success: false, error: 'Photo not found.' }, { status: 404 });
    }

    // 1. Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // 2. Delete from MongoDB
    await Photo.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('API_ADMIN_PHOTO_DELETE_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete photo.' }, { status: 500 });
  }
}
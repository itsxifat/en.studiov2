import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect'; // Adjust path if needed
import Photo from '../../../../models/photo'; // The new model

// This route NO LONGER uses Cloudinary. It just saves to the database.

export async function POST(request) {
  await dbConnect();
  try {
    // 1. Receive JSON data, NOT FormData
    const { projectId, publicId, imageUrl, width, height } = await request.json();

    if (!projectId || !publicId || !imageUrl || !width || !height) {
      return NextResponse.json({ success: false, error: "Missing required photo data." }, { status: 400 });
    }

    // 2. Create Photo document in MongoDB
    const photo = await Photo.create({
      projectId: projectId,
      imageUrl: imageUrl,
      publicId: publicId,
      width: width,
      height: height,
      title: '', // Set to empty as requested
      description: '', // Set to empty as requested
    });

    return NextResponse.json({ success: true, data: photo });

  } catch (error) {
    console.error("Upload API Error (saving to DB):", error);
    return NextResponse.json({ success: false, error: 'Failed to save photo to database.' }, { status: 500 });
  }
}
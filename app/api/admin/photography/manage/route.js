import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Photo from '../../../../models/photo';

export async function GET() {
  await dbConnect();
  try {
    // Fetch all photos and populate the project title
    const photos = await Photo.find({})
      .sort({ createdAt: -1 })
      .populate('projectId', 'title'); // Get the project title

    return NextResponse.json({ success: true, photos: photos });

  } catch (error) {
    console.error("Failed to fetch Cloudinary photos:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch photos.' }, { status: 500 });
  }
}
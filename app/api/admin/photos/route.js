import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect'; // Adjust path if needed
import Photo from '../../../models/photo'; // Adjust path if needed
import mongoose from 'mongoose';

export async function GET(request) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    return NextResponse.json({ success: false, error: 'A valid Project ID is required.' }, { status: 400 });
  }

  try {
    // Find all photos linked to this project
    const photos = await Photo.find({ projectId: projectId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: photos });
  } catch (error) {
    console.error('API_ADMIN_PHOTOS_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch photos.' }, { status: 500 });
  }
}
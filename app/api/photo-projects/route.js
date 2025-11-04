import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import PhotoProject from '../../models/photoProject';

// GET all photo projects for public gallery
export async function GET() {
  await dbConnect();
  try {
    const projects = await PhotoProject.find({})
      .sort({ createdAt: -1 })
      .select('title slug description thumbnail') // Only send public data
      .lean();
      
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('API_PUBLIC_PHOTO_PROJECTS_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch projects.' }, { status: 500 });
  }
}
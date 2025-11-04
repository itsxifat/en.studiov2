import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import PhotoProject from '../../../models/photoProject';
import Photo from '../../../models/photo';
import BtsItem from '../../../models/btsItem'; // ✨ 1. Import BtsItem

export async function GET(request, { params }) {
  await dbConnect();
  const { slug } = params;

  try {
    const project = await PhotoProject.findOne({ slug }).lean();
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
    }

    // 2. Find all photos linked to this project
    const photos = await Photo.find({ projectId: project._id })
      .sort({ createdAt: 'asc' })
      .lean();
    
    // ✨ 3. Find all BTS items linked to this project
    const btsItems = await BtsItem.find({ projectId: project._id })
      .sort({ displayOrder: 'asc' })
      .lean();
      
    // 4. Return all data
    return NextResponse.json({ 
      success: true, 
      data: {
        project,
        photos,
        btsItems, // ✨ Add btsItems to the response
      } 
    });
  } catch (error) {
    console.error('API_PUBLIC_PROJECT_SLUG_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch project data.' }, { status: 500 });
  }
}
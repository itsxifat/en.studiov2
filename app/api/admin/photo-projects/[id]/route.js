import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import PhotoProject from '../../../../models/photoProject';
import Photo from '../../../../models/photo';
import BtsItem from '../../../../models/btsItem'; // ✨ 1. Import BtsItem
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

cloudinary.config({ /* ... credentials ... */ });

// PUT (Update) a project (Simplified)
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await request.json();
    // Only update text fields. File (thumbnail) updates are complex.
    const { title, slug, description } = body;

    const updatedProject = await PhotoProject.findByIdAndUpdate(id, {
      title, slug, description
    }, { new: true, runValidators: true });

    if (!updatedProject) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedProject });

  } catch (error) {
     console.error('API_ADMIN_PHOTO_PROJECTS_PUT_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project.' }, { status: 500 });
  }
}

// DELETE a project (Now deletes all related assets)
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const project = await PhotoProject.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found.' }, { status: 404 });
    }

    // 1. Find and delete all associated Photos
    const photos = await Photo.find({ projectId: id });
    if (photos.length > 0) {
      const publicIds = photos.map(p => p.publicId);
      await cloudinary.api.delete_resources(publicIds);
      await Photo.deleteMany({ projectId: id });
    }

    // ✨ 2. Find and delete all associated BTS items
    const btsItems = await BtsItem.find({ projectId: id });
    if (btsItems.length > 0) {
      const btsImagePublicIds = btsItems
        .filter(item => item.type === 'image' && item.cloudinaryPublicId)
        .map(item => item.cloudinaryPublicId);
      
      if (btsImagePublicIds.length > 0) {
        await cloudinary.api.delete_resources(btsImagePublicIds);
      }
      await BtsItem.deleteMany({ projectId: id });
    }

    // 3. Delete the project thumbnail
    await cloudinary.uploader.destroy(project.thumbnailPublicId);

    // 4. Delete the project itself
    await PhotoProject.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('API_ADMIN_PHOTO_PROJECTS_DELETE_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete project.' }, { status: 500 });
  }
}
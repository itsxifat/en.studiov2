import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import PhotoProject from '../../../models/photoProject';
import { v2 as cloudinary } from 'cloudinary';
import { streamToBuffer } from '../../../lib/streamToBuffer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// GET all photo projects (No changes)
export async function GET() {
  await dbConnect();
  try {
    const projects = await PhotoProject.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects.' }, { status: 500 });
  }
}

// POST a new photo project (Simplified)
export async function POST(request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const slug = formData.get('slug');
    const description = formData.get('description');
    const thumbnailFile = formData.get('thumbnail');

    if (!title || !slug || !thumbnailFile) {
      return NextResponse.json({ success: false, error: 'Title, Slug, and Thumbnail are required.' }, { status: 400 });
    }

    const buffer = await streamToBuffer(thumbnailFile.stream());
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'photo_project_thumbnails' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    if (!uploadResult) {
      throw new Error('Cloudinary thumbnail upload failed.');
    }

    const project = await PhotoProject.create({
      title,
      slug,
      description,
      thumbnail: uploadResult.secure_url,
      thumbnailPublicId: uploadResult.public_id,
      // All BTS fields are removed from here
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });

  } catch (error) {
    console.error('API_ADMIN_PHOTO_PROJECTS_POST_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project.' }, { status: 500 });
  }
}
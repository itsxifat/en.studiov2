import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { streamToBuffer } from '../../../../lib/streamToBuffer'; // Ensure this helper exists
import dbConnect from '../../../../lib/dbConnect'; // Adjust path if needed
import Photo from '../../../../models/photo'; // The new model

// Configure Cloudinary (ensure .env variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const files = formData.getAll('files'); // ✨ Changed to getAll('files')
    const projectId = formData.get('projectId');

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided." }, { status: 400 });
    }
    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID is required." }, { status: 400 });
    }

    // Handle all file uploads in parallel
    const uploadPromises = files.map(async (file) => {
      // 1. Upload to Cloudinary
      const buffer = await streamToBuffer(file.stream());
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'portfolio_photos',
            // ✨ Removed context, as title/description are no longer needed
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      
      if (!uploadResult) throw new Error('Cloudinary upload failed for one or more files.');

      // 2. Create Photo document in MongoDB
      const photo = await Photo.create({
        projectId: projectId,
        imageUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        title: '', // Set to empty as requested
        description: '', // Set to empty as requested
      });
      return photo;
    });

    // Wait for all uploads and database entries to complete
    const createdPhotos = await Promise.all(uploadPromises);

    // Return the count of uploaded photos
    return NextResponse.json({ success: true, data: createdPhotos, count: createdPhotos.length });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Upload failed.' }, { status: 500 });
  }
}
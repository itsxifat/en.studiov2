import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { streamToBuffer } from '../../../../lib/streamToBuffer'; // Ensure this helper file exists
import dbConnect from '../../../../lib/dbConnect'; // Adjust path if needed
import Photo from '../../../../models/photo'; // Adjust path if needed

// --- THIS IS THE FIX ---
// Add the Cloudinary configuration at the top of the file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
// --- END OF FIX ---

export async function POST(request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const projectId = formData.get('projectId');
    const title = formData.get('title') || '';
    const description = formData.get('description') || '';

    if (!file || !projectId) {
      return NextResponse.json({ success: false, error: "File and Project ID are required." }, { status: 400 });
    }

    // 1. Upload to Cloudinary
    const buffer = await streamToBuffer(file.stream());
    
    // This line was failing
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'portfolio_photos', // A new folder for all project photos
          context: `title=${title}|description=${description}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    if (!uploadResult) throw new Error('Cloudinary upload failed.');

    // 2. Create Photo document in MongoDB
    const photo = await Photo.create({
      projectId: projectId,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      title: title,
      description: description,
    });

    return NextResponse.json({ success: true, data: photo });

  } catch (error) {
    console.error("Upload API Error:", error);
    // Return the specific error message
    return NextResponse.json({ success: false, error: error.message || 'Upload failed.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Writable } from 'stream';

// Configure Cloudinary (keep as is)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper streamToBuffer (keep as is)
const streamToBuffer = async (readableStream) => {
  // ... (keep existing code)
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') || ''; // Default to empty string
    const description = formData.get('description') || ''; // Default to empty string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }

    const buffer = await streamToBuffer(file.stream());

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio',
          // ✨ MODIFIED: Add isFeatured=false to context
          context: `title=${title}|description=${description}|isFeatured=false`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, data: uploadResult });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ success: false, error: 'Upload failed.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Writable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper to convert a file buffer for streaming
const streamToBuffer = async (readableStream) => {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

// Main POST handler for uploading
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const description = formData.get('description');

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = await streamToBuffer(file.stream());

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio', // All uploads go to the "portfolio" folder
          // We store title/description in the 'context' metadata field
          context: `title=${title}|description=${description}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      // Pipe the buffer to the upload stream
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, data: uploadResult });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ success: false, error: 'Upload failed.' }, { status: 500 });
  }
}
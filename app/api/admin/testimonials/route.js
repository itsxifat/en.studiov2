import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect'; 
import Testimonial from '../../../models/testimonial'; 
import { v2 as cloudinary } from 'cloudinary';
import { streamToBuffer } from '../../../lib/streamToBuffer'; 

// Configure Cloudinary (ensure .env variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// GET all testimonials
export async function GET() {
  await dbConnect();
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('API_ADMIN_TESTIMONIALS_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials.' }, { status: 500 });
  }
}

// POST a new testimonial
export async function POST(request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    const quote = formData.get('quote')?.trim();
    const name = formData.get('name')?.trim();
    const project = formData.get('project')?.trim() || '';
    const file = formData.get('file'); // The image file

    if (!quote || !name) {
      return NextResponse.json({ success: false, error: 'Quote and Name are required.' }, { status: 400 });
    }

    let photoUrl = null;
    let publicId = null;

    // Handle file upload if present
    if (file && file.size > 0) {
      const buffer = await streamToBuffer(file.stream());

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'testimonials' }, // Upload to a 'testimonials' folder
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      if (!uploadResult?.secure_url) {
        throw new Error('Cloudinary upload failed.');
      }
      photoUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    // Create testimonial in DB
    const testimonialData = {
      quote,
      name,
      project,
      photo: photoUrl,
      cloudinaryPublicId: publicId,
    };
    const testimonial = await Testimonial.create(testimonialData);

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });

  } catch (error) {
     if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(val => val.message);
       return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 });
     }
    console.error('API_ADMIN_TESTIMONIALS_POST_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to create testimonial.' }, { status: 500 });
  }
}
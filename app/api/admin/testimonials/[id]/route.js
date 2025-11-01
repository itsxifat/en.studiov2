import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect'; // Adjust path
import Testimonial from '../../../../models/testimonial'; // Adjust path
import { v2 as cloudinary } from 'cloudinary';
import { streamToBuffer } from '../../../../lib/streamToBuffer'; // Adjust path
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({ /* ... credentials ... */ });

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET a single testimonial by ID
export async function GET(request, { params }) {
    await dbConnect();
    const { id } = params;

    if (!isValidObjectId(id)) {
        return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

    try {
        const testimonial = await Testimonial.findById(id).lean();
        if (!testimonial) {
            return NextResponse.json({ success: false, error: 'Testimonial not found.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: testimonial });
    } catch (error) {
        console.error('API_ADMIN_TESTIMONIALS_GET_ID_ERROR:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch testimonial.' }, { status: 500 });
    }
}


// PUT update a testimonial by ID
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const quote = formData.get('quote')?.trim();
    const name = formData.get('name')?.trim();
    const project = formData.get('project')?.trim() || '';
    const file = formData.get('file');

    if (!quote || !name) {
      return NextResponse.json({ success: false, error: 'Quote and Name are required.' }, { status: 400 });
    }

    const existingTestimonial = await Testimonial.findById(id);
    if (!existingTestimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found.' }, { status: 404 });
    }

    const updateData = { quote, name, project };

    // Handle file update
    if (file && file.size > 0) {
      // Delete old image from Cloudinary if it exists
      if (existingTestimonial.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(existingTestimonial.cloudinaryPublicId);
        } catch (deleteError) {
          console.error("Failed to delete old Cloudinary image:", deleteError);
          // Decide if you want to proceed or return an error
        }
      }

      // Upload new image
      const buffer = await streamToBuffer(file.stream());
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'testimonials' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

       if (!uploadResult?.secure_url) {
        throw new Error('Cloudinary upload failed during update.');
       }
       updateData.photo = uploadResult.secure_url;
       updateData.cloudinaryPublicId = uploadResult.public_id;

    } else if (formData.has('remove_photo') && formData.get('remove_photo') === 'true') {
        // Handle explicit photo removal
        if (existingTestimonial.cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(existingTestimonial.cloudinaryPublicId);
            } catch (deleteError) {
                 console.error("Failed to delete Cloudinary image during removal:", deleteError);
            }
        }
        updateData.photo = null;
        updateData.cloudinaryPublicId = null;
    }
    // If no new file and not removing, photo fields remain unchanged


    const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validation
    });

    return NextResponse.json({ success: true, data: updatedTestimonial });

  } catch (error) {
     if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(val => val.message);
       return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 });
     }
    console.error('API_ADMIN_TESTIMONIALS_PUT_ID_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to update testimonial.' }, { status: 500 });
  }
}

// DELETE a testimonial by ID
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

   if (!isValidObjectId(id)) {
        return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
    }

  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found.' }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (testimonial.cloudinaryPublicId) {
      try {
        const deleteResult = await cloudinary.uploader.destroy(testimonial.cloudinaryPublicId);
        if (deleteResult.result !== 'ok' && deleteResult.result !== 'not found') {
            // Log warning but proceed with DB deletion
            console.warn("Cloudinary deletion might have failed:", deleteResult);
        }
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Decide if this should prevent DB deletion (maybe not, allow orphan records?)
      }
    }

    // Delete from MongoDB
    await Testimonial.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} }); // Return empty object on success

  } catch (error) {
    console.error('API_ADMIN_TESTIMONIALS_DELETE_ID_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete testimonial.' }, { status: 500 });
  }
}
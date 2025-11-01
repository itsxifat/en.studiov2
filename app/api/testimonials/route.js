import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect'; // Adjust path if needed
import Testimonial from '../../models/testimonial'; // Adjust path if needed

// GET all testimonials (for public display)
export async function GET() {
  await dbConnect();
  try {
    // Fetch only necessary fields, sorted by newest
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 })
      .select('quote name project photo') // Select only needed fields
      .limit(10) // Optionally limit the number shown on the frontend
      .lean();

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('API_TESTIMONIALS_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials.' }, { status: 500 });
  }
}
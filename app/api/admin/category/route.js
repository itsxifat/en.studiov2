import dbConnect from '../../../lib/dbConnect';
import Category from '../../../models/Category';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/admin/category
 * @description Get all categories.
 */
export async function GET() {
  await dbConnect();
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    // Add "All" manually in the API response for frontend filtering purposes
    const allCategories = [{ _id: 'all', name: 'All' }, ...categories];
    return NextResponse.json({ success: true, data: allCategories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * @route POST /api/admin/category
 * @description Add a new category.
 */
export async function POST(request) {
  await dbConnect();
  
  try {
    const { name } = await request.json();
    
    if (name.toLowerCase() === 'all') {
      return NextResponse.json({ success: false, error: 'The name "All" is reserved.' }, { status: 400 });
    }

    const category = await Category.create({ name });
    
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    let errorMessage = 'Failed to create category.';
    if (error.code === 11000) {
      errorMessage = `Category name '${error.keyValue.name}' already exists.`;
    } else if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
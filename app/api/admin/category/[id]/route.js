import dbConnect from '../../../../lib/dbConnect';
import Category from '../../../../models/Category';
import PortfolioItem from '../../../../models/portfolioItem';
import { NextResponse } from 'next/server';

/**
 * @route DELETE /api/admin/category/[id]
 * @description Delete a category.
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  
  try {
    const categoryId = params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found.' }, { status: 404 });
    }

    const categoryName = category.name;

    // 1. Check if any PortfolioItem uses this category
    const count = await PortfolioItem.countDocuments({ category: categoryName });
    if (count > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete category "${categoryName}" because ${count} portfolio item(s) are using it.`,
        code: 'IN_USE' // Custom error code for frontend handling
      }, { status: 409 });
    }

    // 2. Delete the category
    await Category.deleteOne({ _id: categoryId });
    
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete category.' }, { status: 500 });
  }
}
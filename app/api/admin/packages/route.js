import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import PricingPackage from '../../../models/pricingPackage';
import Service from '../../../models/service'; // Import Service to ensure model is registered

// GET all packages
export async function GET() {
  await dbConnect();
  try {
    const packages = await PricingPackage.find({})
      .sort({ displayOrder: 1 })
      .populate('serviceId', 'title');
    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch packages.' }, { status: 500 });
  }
}

// POST a new package
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Validation now includes 'description' but it's optional (can be empty string)
    if (!body.serviceId || !body.packageName || !body.quantity || !body.unitPrice || !body.totalPrice) {
      return NextResponse.json({ success: false, error: 'All fields except Description are required.' }, { status: 400 });
    }
    // Ensure description is at least an empty string if not provided
    if (!body.description) {
      body.description = '';
    }
    const newPackage = await PricingPackage.create(body);
    return NextResponse.json({ success: true, data: newPackage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create package.' }, { status: 500 });
  }
}
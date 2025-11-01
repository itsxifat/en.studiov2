import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import PricingPackage from '../../../../models/pricingPackage';
import Service from '../../../../models/service';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// PUT (Update) a package
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }
  try {
    const body = await request.json();
    // Validation for update
    if (!body.serviceId || !body.packageName || !body.quantity || !body.unitPrice || !body.totalPrice) {
      return NextResponse.json({ success: false, error: 'All fields except Description are required.' }, { status: 400 });
    }

    const updatedPackage = await PricingPackage.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPackage) {
      return NextResponse.json({ success: false, error: 'Package not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedPackage });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update package.' }, { status: 500 });
  }
}

// DELETE a package
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }
  try {
    const deletedPackage = await PricingPackage.findByIdAndDelete(id);
    if (!deletedPackage) {
      return NextResponse.json({ success: false, error: 'Package not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete package.' }, { status: 500 });
  }
}
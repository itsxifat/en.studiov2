import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Service from '../../../../models/service';
import PricingPackage from '../../../../../models/pricingPackage'; // 1. Import PricingPackage
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET a single service by ID
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }
  try {
    const service = await Service.findById(id).lean();
    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch service.' }, { status: 500 });
  }
}

// PUT (Update) a service
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }
  try {
    const body = await request.json();
    if (!body.title || !body.description || !body.icon || !body.startingPrice) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }
    const updatedService = await Service.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedService) {
      return NextResponse.json({ success: false, error: 'Service not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedService });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update service.' }, { status: 500 });
  }
}

// DELETE a service (also deletes associated packages)
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  if (!isValidObjectId(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID format.' }, { status: 400 });
  }
  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return NextResponse.json({ success: false, error: 'Service not found.' }, { status: 404 });
    }
    
    // 2. Delete all packages linked to this service
    await PricingPackage.deleteMany({ serviceId: id });
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete service.' }, { status: 500 });
  }
}
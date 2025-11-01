import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Service from '../../../models/service';
import PricingPackage from '../../../models/pricingPackage';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// We pass 'context' as the second argument, which contains 'params'
export async function GET(request, context) {
  await dbConnect();
  
  // Destructure params from the context object
  const { params } = context;
  const { serviceId } = params; // This is now 100% safe

  if (!isValidObjectId(serviceId)) {
    return NextResponse.json({ success: false, error: 'Invalid Service ID.' }, { status: 400 });
  }

  try {
    // Fetch the service details
    const service = await Service.findById(serviceId).lean();
    
    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found.' }, { status: 404 });
    }

    // Fetch all packages linked to this service
    const packages = await PricingPackage.find({ serviceId: serviceId })
      .sort({ displayOrder: 'asc' })
      .lean();
    
    // Return the combined data
    return NextResponse.json({ 
      success: true, 
      data: {
        service: service,
        packages: packages
      } 
    });

  } catch (error) {
    console.error("API_PUBLIC_PACKAGE_DETAILS_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch package data.' }, { status: 500 });
  }
}
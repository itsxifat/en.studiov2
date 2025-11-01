import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import PricingPackage from '../../models/pricingPackage';

export async function GET() {
  await dbConnect();
  try {
    const packages = await PricingPackage.find({}).sort({ serviceType: 1, displayOrder: 1 }).lean();
    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch packages.' }, { status: 500 });
  }
}